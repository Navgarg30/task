const express = require("express");
const HttpStatusCodes = require("./utils/httpStatusCode.js");
const {getAllTasks,getTask,createTask,pathTask,putTask,deleteTask} = require("./controllers/taskController.js");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const appError = require("./utils/appError.js");
const globalErrorHandler = require("./utils/globalErrorHandler.js");
const morgan = require("morgan"); 

dotenv.config({
    path: "./.env"
});
const app = express();

app.use(express.json());
app.use(morgan("common"));

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    console.log(req.requestTime);
    next();
})
    
app.get("/", (req, res) => { 
    res.send("Hello World!");
})

app.get("/api/v1/tasks", getAllTasks);

app.get("/api/v1/tasks/:id/:dest?/:place?",getTask);

app.post("/api/v1/tasks", createTask);

app.patch("/api/v1/tasks/:id", pathTask);

app.delete("/api/v1/tasks/:id", deleteTask);

app.put("/api/v1/tasks", putTask);

app.all("*", (req, res, next ) => {
    // res.status(HttpStatusCodes.NOT_FOUND).json({
    //     status: "fail",
    //     message: `Can't find ${req.originalUrl} on this server`
    // })
    // const err = new Error(`Can't find ${req.originalUrl} on this server`);
    // err.statusCode = HttpStatusCodes.NOT_FOUND;
    // err.status = "fail";
    next(new appError(`Can't find ${req.originalUrl} on this server`, HttpStatusCodes.NOT_FOUND));
});

app.use(globalErrorHandler);

const DB = process.env.MONGO_DB_CONNECTION.replace("<password>", process.env.MONGO_DB_PASSWORD);
mongoose.connect(DB)
    .then(() => console.log("DB connection successfull!"))
    .catch((err) => console.log(err));

app.listen(3000, () => {
    console.log("Server running on port 3000");
});


