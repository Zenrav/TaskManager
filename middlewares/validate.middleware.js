import { z } from 'zod';

export const validate = (schema) =>{
    return(req, res, next) =>{
        const result = schema.safeParse(req.body)
        if(!result.success){
            const errors = z.prettifyError(result.error);
            return res.status(400).json({
                success : false,
                message : 'Validation failed',
                errors
            })
        }
        req.body = result.data
        next()
    }
}

