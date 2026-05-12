import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import { JWT_SECRET } from '../config/env.js';

const authMiddleware = async (req, res, next) =>{
    try{
        const authHeader = req.headers.authorization;
        if(!authHeader || !authHeader.startsWith('Bearer')){
            return res.status(401).json({
                success : false,
                message : "No token provided, access denied"
            });
        }

        const token = authHeader.split(' ')[1];

        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.id);
        if(!user){
            return res.status(401).json({
                success : false,
                message : 'User no longer exists'
            });
        }
        req.user = user;
        next();
        
    }catch(error){
        return res.status(401).json({
            success : false,
            message : 'Invalid or expired token'
        })
    }
}

export default authMiddleware;
