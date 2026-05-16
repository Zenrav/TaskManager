import { z } from 'zod';

export const registerSchema = z.object({
    name: z.string().min(3).max(60),
    email: z.string().email({message : "Invalid email address"}).regex(/^[a-z0-9](\.?[a-z0-9]){4,29}@gmail\.com$/i,{
        message : "Only Gmail addresses are allowed",
    }),
    password: z.string().min(8).max(15),
    userId: z.string().min(3)
})

export const loginSchema = z.object({
    email: z.string().email({message : "Invalid email address"}).regex(/^[a-z0-9](\.?[a-z0-9]){4,29}@gmail\.com$/i,{
        message : "Only Gmail addresses are allowed",
    }),
    password: z.string().min(8, 'Password is required')
})

export const createTaskSchema = z.object({
    title : z.string().min(3).max(50),
    description : z.string().min(5).max(120),
    status : z.enum(['pending', 'in-progress', 'completed']).optional(),
    deadline : z.string().datetime(),
    importance: z.enum(['high', 'medium', 'low']),
    assignedTo: z.string().min(1, 'AssignedTo is required')
})

export const updateTaskSchema = z.object({
    title : z.string().min(3).max(50).optional(),
    description : z.string().min(5).max(120).optional(),
    status : z.enum(['pending', 'in-progress', 'completed']).optional(),
    deadline : z.string().datetime().optional(),
    importance: z.enum(['high', 'medium', 'low']).optional(),
    assignedTo: z.string().optional()

})

export const createEngineerSchema = z.object({
    name : z.string().min(3).max(60),
    email: z.string().email(),
    password : z.string().min(8).max(15),
    userId: z.string().min(3)
})