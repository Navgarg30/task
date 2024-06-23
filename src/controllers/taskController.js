const Task = require("../models/taskModel.js");
const AppError = require("../utils/appError.js");
const HttpStatusCodes = require("../utils/httpStatusCode.js");
const catchAsync = require("../utils/catchAsync.js");

const tasks = [
    {
        id: 1,
        text: "Doctors Appointment",
        day: "Feb 5th at 2:30pm",
        reminder: true
    },{
        id: 2,
        text: "Meeting at School",
        day: "Feb 6th at 1:30pm",
        reminder: true
    },{
        id: 3,
        text: "Food Shopping",
        day: "Feb 5th at 2:30pm",
        reminder: false
    },{
        id: 4,
        text: "Fod Shoping",
        day: "Feb 5th at 2:30pm",
        reminder: false
    }
];


const getAllTasks = catchAsync( async (req, res, next) => {

    const query = Task.find({});
    const result = await query.select("-__v");
    res.status(HttpStatusCodes.OK).json({
        status: "success",
        results:result.length,
        data: {
        tasks: result
        }
    })
})

const getTask = catchAsync( async(req, res, next) => {
    const taskId = req.params.id;
        const query =  Task.findById(taskId);
        const task = await query.select("-__v");
        //const id = parseInt(req.params.id);
        //const task = tasks.find(task => task.id === id)

        res.status(HttpStatusCodes.OK).json({
            status: "success",
            results:1,
            requestTime: req.requestTime,
            data: {
                task
            }
        })
    // try {
    //     const taskId = req.params.id;
    //     const query =  Task.findById(taskId);
    //     const task = await query.select("-__v");
    //     //const id = parseInt(req.params.id);
    //     //const task = tasks.find(task => task.id === id)

    //     res.status(HttpStatusCodes.OK).json({
    //         status: "success",
    //         results:1,
    //         data: {
    //             task
    //         }
    //     })
    // } catch (error) {
    //     next(new AppError(error, HttpStatusCodes.NOT_FOUND));
    //     // res.status(HttpStatusCodes.NOT_FOUND).json({
    //     //     status: "fail",
    //     //     message: error,
    //     // })
    // }
})

const createTask = catchAsync( async  (req, res, next) => {
    const body = req.body;
        const newTask = await Task.create({
            text: body.text,
            day: body.day,
            reminder: body.reminder
        });

        res.status(HttpStatusCodes.CREATED).json({
            status: "success",
            data: {
                task : newTask
            }
    })
})

const pathTask = catchAsync( async(req, res, next) => {
    const taskId=req.params.id;
    const task =await  Task.findByIdAndUpdate(taskId,req.body,{
        new:true,
    })

    res.status(HttpStatusCodes.OK).json({
        status: "success",
        data: {
            task
        }
    })  
})

const putTask = (req, res) => {
    try {
        
    const body = req.body;
    const task = tasks.find(task => task.id === body.id);
    if(task){
        const index = tasks.length-1;
        tasks[index].text = req.body.text;
        tasks[index].day = req.body.day;
        tasks[index].reminder = req.body.reminder;

        const task = tasks.find(task => task.id === body.id);

        res.status(HttpStatusCodes.OK).json({
            status: "success",
            data: {
                task
            }
        })
    }
    else{
        const id = tasks.length + 1;
        body.id = id;
        const newTask = {
           ...body 
        }
        tasks.push(newTask);
    
        res.status(HttpStatusCodes.CREATED).json({
            status: "success",
            data: {
                task : newTask
            }
        })
    }
    } catch (error) {
        res.status(HttpStatusCodes.NOT_FOUND).json({
            status: "fail",
            message: error,
        })
    }
}

const deleteTask = catchAsync( async(req, res, next) => {
    const taskId = req.params.id;
    await  Task.findByIdAndDelete(taskId);

    res.status(HttpStatusCodes.NO_CONTENT).json({
        status: "success",
        data: null
    })
})

module.exports = {
    getAllTasks,
    getTask,    
    createTask,     
    pathTask,    
    putTask,    
    deleteTask
}