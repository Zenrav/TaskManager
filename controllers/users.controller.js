import User from "../models/user.model.js";
import { aj } from '../config/arcjet.js';
export const createEngineer = async (req, res, next) =>{
    try{
        const decision = await aj.protect(req, { requested : 3})
        if (decision.isDenied()){
            return res.status(429).json({
                success : false,
                message : "Too many attempts, please try again later"
            });
        }
        const {name, email, userId, password} = req.body;

        const existingEngineer = await User.findOne({$or: [{email}, {userId}]});
        if(existingEngineer){
            return res.status(409).json({
                success : false,
                message : existingEngineer.email === email ? 'Email already in use' : 'User Id already in use'
            });
        }
        const engineer = await User.create({
            name: name,
            email: email,
            userId: userId,
            password : password,
            role : 'engineer',
            createdBy : req.user.userId,
        });

        res.status(200).json({
            success: true,
            data : {engineer}
        });
    }catch(error){
        next(error);
    }
}

export const getUser = async(req, res, next) =>{
    try{
        const decision = await aj.protect(req, { requested : 1})
        if (decision.isDenied()){
            return res.status(429).json({
                success : false,
                message : "Too many attempts, please try again later"
            });
        }
        const userId = req.params.userId;
        const user = await User.findOne({userId});
        if(!user){
            return (
                res.status(404).json({
                    status: false,
                    message : "User does not exist."
                })
            )
        }
        res.status(200).json({
            success : true,
            data : {user}
        });
        
    }catch(error){
        next(error);
    }
}


export const getAllUsers = async (req, res, next) =>{
    try{
        const decision = await aj.protect(req, { requested : 1})
        if (decision.isDenied()){
            return res.status(429).json({
                success : false,
                message : "Too many attempts, please try again later"
            });
        }
        const users = await User.find({});
        res.status(200).json({
            success: true,
            count : users.length,
            data : {users}
        });
    }catch(error){
        next(error);
    }
}


export const updateUser = async (req, res, next) => {
    try{
        const decision = await aj.protect(req, { requested : 2})
        if (decision.isDenied()){
            return res.status(429).json({
                success : false,
                message : "Too many attempts, please try again later"
            });
        }
        const userId = req.params.userId;
        const {name, email} = req.body;
        const user = await User.findOneAndUpdate({userId}, { name, email}, {
            new : true,
            runValidators: true
        });
        if(!user){
            return (
                res.status(404).json({
                    status: false,
                    message : "User does not exist."
                })
            )
        }
        res.status(200).json({
            success : true,
            data : {user}
        })
    
    }catch(error){
        next(error);
    }
}


export const deleteUser = async(req, res, next) =>{
    try{
        const decision = await aj.protect(req, { requested : 3})
        if (decision.isDenied()){
            return res.status(429).json({
                success : false,
                message : "Too many attempts, please try again later"
            });
        }
        const id = req.params.id;
        const user = await User.findByIdAndDelete(id);
        if (!user){
            return res.status(404).json({
                success: false,
                message : `No user found with id ${id}`
            })
        }
        res.status(200).json({
            success: true,
            message : "User deleted successfully",
            data : {}
        })
    }catch(error){
        next(error);
    }
}

