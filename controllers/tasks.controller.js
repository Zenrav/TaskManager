import Task from "../models/task.model.js"
import User from "../models/user.model.js"
import { aj } from '../config/arcjet.js';
import { calculatePriority } from "../utils/priority.js";
import { getCache, setCache, deleteCache, deleteCacheByPattern } from '../utils/cache.js'

export const createTask = async (req, res, next) =>{
    try{
        const decision = await aj.protect(req, { requested : 2})
        if (decision.isDenied()){
            return res.status(429).json({
                success : false,
                message : "Too many attempts, please try again later"
            });
        }
        const {title, description, status, deadline, importance, assignedTo} = req.body;
        const task = await Task.create({
            title, 
            description,
            status,
            deadline,
            importance,
            assignedTo
        });

        await deleteCacheByPattern('tasks:all:*');
        await deleteCacheByPattern('tasks:engineer:*')

        res.status(200).json({success: true,data:{task} })
    }catch(error){
        next(error);
    }
}

export const getAllTasks = async (req, res, next) =>{
    try{
        const decision = await aj.protect(req, { requested : 1})
        if (decision.isDenied()){
            return res.status(429).json({
                success : false,
                message : "Too many attempts, please try again later"
            });
        }
        const {status, importance, deadline,assignedTo, sort} = req.query;
        const cacheKey = `tasks:all:${JSON.stringify(req.query)}`
        const cachedTasks = await getCache(cacheKey);

        if (cachedTasks){
            return res.status(200).json({
                success : true, 
                source : 'cache',
                count : cachedTasks.length,
                data : { updatedTasks : cachedTasks }
            })
        }


        let filter = {};
        if(status) filter.status = status;
        if(importance) filter.importance = importance;
        if(deadline){
            const deadlineDate = new Date(deadline);
            filter.deadline = deadlineDate;
        }

        if(assignedTo){
            const user = await User.findOne({"userId" : assignedTo});
            if(!user){
                return (
                    res.status(404).json({
                        success : false,
                        message : "User does not exist"             
                    })
                )
            }else{
                filter.assignedTo = user._id;
            }
        }

        const tasks = await Task.find(filter).lean().populate("assignedTo", "name email");
        if (sort == 'deadline'){
            tasks.sort((a,b) => new Date(a.deadline) - new Date(b.deadline));
        }
        const updatedTasks = tasks.map(task =>{ 
            const d = new Date(task.deadline);        
            return{
                ...task,
                priorityScore: calculatePriority(task),
                deadline: d.toLocaleDateString('en-US', { 
                    month: 'long', 
                    day: 'numeric', 
                    year: 'numeric' 
                })
            }

        })

        if (sort == 'score'){
            updatedTasks.sort((a,b) => b.priorityScore - a.priorityScore);
        }
        await setCache(cacheKey, updatedTasks);
        res.status(200).json({success:true, count: updatedTasks.length , source : "database", data : {updatedTasks}});
    }catch(error){
        next(error);
    }
}

export const getTaskById = async (req, res, next) =>{
    try{
        const decision = await aj.protect(req, { requested : 1})
        if (decision.isDenied()){
            return res.status(429).json({
                success : false,
                message : "Too many attempts, please try again later"
            });
        }
        const id = req.params.id;
        const cacheKey = `tasks:single:${id}`
        const cachedTask = await getCache(cacheKey);
        if (cachedTask){
            return res.status(200).json({
                success : true,
                source : 'cache',
                data : cachedTask
            })
        }
        const task = await Task.findById(id).populate("assignedTo", "name email");
        if (!task){
            return res.status(404).json({
                success: false,
                message : `No task found with id ${id}`
            })
        }
        await setCache(cacheKey, task);
        res.status(200).json({success : true, data:{task}});
    }catch(error){
        next(error);
    }
}

export const updateTask = async (req, res, next) =>{
    try{
        const decision = await aj.protect(req, { requested : 2})
        if (decision.isDenied()){
            return res.status(429).json({
                success : false,
                message : "Too many attempts, please try again later"
            });
        }
        const id = req.params.id;

        const newTask = await Task.findByIdAndUpdate(id, req.body,{
            new: true,
            runValidators: true
        });
        if (!newTask){
            return res.status(404).json({
                success: false,
                message : `No task found with id ${id}`
            })
        }
        await deleteCacheByPattern('tasks:all:*');
        await deleteCacheByPattern('tasks:engineer:*');
        await deleteCache(`tasks:single:${id}`)
        res.status(200).json({success : true, data : {newTask}});
    }catch(error){
        next(error);
    }
}

export const deleteTask = async (req, res, next) =>{
    try{
        const decision = await aj.protect(req, { requested : 3})
        if (decision.isDenied()){
            return res.status(429).json({
                success : false,
                message : "Too many attempts, please try again later"
            });
        }
        const id = req.params.id;
        await deleteCache(`tasks:single:${id}`);
        await deleteCacheByPattern('tasks:all:*');
        await deleteCacheByPattern('tasks:engineer:*');
        const task = await Task.findByIdAndDelete(id);
        
        if (!task){
            return res.status(404).json({
                success: false,
                message : `No task found with id ${id}`
            })
        }
        res.status(200).json({
            success: true,
            message : "Task deleted successfully",
            data : {}
        })
    }catch(error){
        next(error);
    }
}

export const getMyTasks = async(req, res, next) =>{
    try{
        const decision = await aj.protect(req, { requested : 1})
        if (decision.isDenied()){
            return res.status(429).json({
                success : false,
                message : "Too many attempts, please try again later"
            });
        }

        const cacheKey = `tasks:engineer:${req.user._id}`
        const cachedTask = await getCache(cacheKey);
        if(cachedTask){
            return res.status(200).json({
                success : true,
                source : 'cache',
                count : cachedTask.length,
                data : { userTasks : cachedTask }
            })
        }

        const tasks = await Task.find({ assignedTo: req.user._id })
            .populate("assignedTo", "name email")
            .lean();
        const updatedTasks = tasks.map((task) => {
            const d = new Date(task.deadline);
            return {
                ...task,
                priorityScore: calculatePriority(task),
                deadline: d.toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                }),
            };
        });

        await setCache(cacheKey, updatedTasks, 120);
        res.status(200).json({
            success: true,
            count: updatedTasks.length,
            data: { userTasks: updatedTasks },
        });

    }catch(error){
        next(error);
    }
}