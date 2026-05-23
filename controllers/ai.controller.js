import Task from "../models/task.model.js";
import { GOOGLE_API_KEY } from "../config/env.js";
import { GoogleGenAI } from "@google/genai";
import { getCache, setCache } from '../utils/cache.js';
 const generateSchedule = async (userId) =>{
    const todayStr = new Date().toISOString().split('T')[0];
    const cacheKey = `schedule:${userId}:${todayStr}`;

    const cachedSchedule = await getCache(cacheKey);
    if(cachedSchedule){
        return cachedSchedule;
    }
    const tasks = await Task.find({assignedTo: userId}).lean();
    if(tasks.length === 0){
        return "You have no pending tasks. Enjoy your day!";
    }

    const tasksJsonString = JSON.stringify(tasks);
    const ai = new GoogleGenAI({apiKey: GOOGLE_API_KEY});
    const PROMPT = `You are a productivity assistant for a task management system.

    Here are the engineer's current tasks:
    ${tasksJsonString}

    Today's date is ${new Date().toDateString()}.

    Based on the deadlines, importance levels and priority scores,
    create a practical schedule for today. Give the result in the JSON format and keep it clearly defined in headings in this order:
    - How many hours to spend on it today
    - What to focus on first  
    - Which tasks are critical and need immediate attention

    
    Be specific, concise and actionable.`;


    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: PROMPT
    });

    const schedule = response.text;
    await setCache(cacheKey, schedule, 86400);

    return schedule;
}

export const aiSchedule = async(req, res, next) =>{
    try{

        const user = req.user._id;
        const scheduleText = await generateSchedule(user.userId);

        return res.status(200).json({
            success : true,
            data : {scheduleText}
        })
    }catch(err){
        next(err);
    }
}


export const askAi = async(req, res, next) => {
    try{

        const { question } = req.body;
        const user = req.user._id;
        const tasks = await Task.find({assignedTo: user.userId}).lean();
        const scheduleText = await generateSchedule(user.userId);
        const PROMPT = `You are a conversational productivity coach for a task management system. 
        Here is the engineer's current task data:
        ${JSON.stringify(tasks)}
        Here is their current schedule layout for today:
        ${scheduleText}
        Today's date is ${new Date().toDateString()}.
        The engineer has a question or request:
        "${question}"
        Provide a direct, clear, and actionable response based on their tasks and schedule.`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: PROMPT
        });

        return res.status(200).json({
            success: true,
            message : "AI response generated successfully",
            data: {answer: response.text}
        });

    }catch(err){
        next(err);
    }
}
