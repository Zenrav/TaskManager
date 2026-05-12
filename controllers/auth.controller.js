import User from '../models/user.model.js';
import jwt from 'jsonwebtoken'
import { JWT_EXPIRES_IN, JWT_SECRET } from '../config/env.js';
import { aj } from '../config/arcjet.js';

const generateToken = (id) =>{
    return jwt.sign(
        { id },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN}
    )
}

export const register = async(req, res, next) =>{
    try{
        const decision = await aj.protect(req, { requested : 1})
        if (decision.isDenied()){
            return res.status(429).json({
                success : false,
                message : "Too many attempts, please try again later"
            });
        }
        const {name, email, password, userId} = req.body;

        if(!name || !email || !password || !userId){
            return res.status(400).json({
                success: false,
                message : "All required fields not entered."
            });
        }
        const user = await User.findOne({ $or: [{ email }, { userId }]});
        if(user){
            return res.status(409).json({
                success : false,
                message : 'User already exists'
            })
        }
        const newUser = await User.create({
            name,
            email, 
            password,
            userId,
            role: 'manager'
        });

        const userResponse = newUser.toObject();
        delete userResponse.password;

        const token = generateToken(newUser._id);
        return res.status(201).json({
            success: true,
            message : 'Account Sucessfully created!',
            token,
            data : {userResponse}
        });
    }catch(error){
        next(error);
    }
}



export const login = async (req, res, next) => {

    try {
        const decision = await aj.protect(req, { requested : 1})
        if (decision.isDenied()){
            return res.status(429).json({
                success : false,
                message : "Too many attempts, please try again later"
            });
        }
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required',
            });
        }

        const user = await User.findOne({ email }).select('+password');
        if(!user){
            return res.status(401).json({
                success : false,
                message : "Invalid email or password",
            });
        }
        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password',
            });
        }

        const token = generateToken(user._id);

        return res.status(200).json({
            success: true,
            token,
            message: 'User logged in!',
        });
    } catch (error) {
        next(error);
    }
};




