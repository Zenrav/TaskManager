import Task from "../models/task.model.js";


import { emailQueue } from '../queues/emailQueue.js'

function startOfLocalDay(d) {
    const x = new Date(d);
    x.setHours(0, 0, 0, 0);
    return x;
}

function endOfLocalDay(d) {
    const x = new Date(d);
    x.setHours(23, 59, 59, 999);
    return x;
}

export const runDeadlineCheck = async () =>{
    try{
        console.log('run deadline check..')
        const todayStart = startOfLocalDay(new Date());
        const dueDayStart = new Date(todayStart);
        dueDayStart.setDate(dueDayStart.getDate() + 2);
        const dueDayEnd = endOfLocalDay(dueDayStart);
        const tasks = await Task.find({
            status : "pending",
            reminderSent : false,
            deadline : {
                $gte: dueDayStart,
                $lte: dueDayEnd
            }
        }).populate("assignedTo", "name email");
        console.log('Number of tasks approaching due date : '  + tasks.length);
        for (const task of tasks ){
            await emailQueue.add('send-reminder', {
                to: task.assignedTo.email,
                name : task.assignedTo.name,
                taskTitle : task.title,
                taskId : task._id,
                deadline : task.deadline
            })
            
            task.reminderSent = true;
            await task.save();

            console.log(`[Cron] Job added to queue for: ${task.assignedTo.email}`);
        }
    }catch(error){
        console.error("Error in runDeadlineCheck:", error);
    }

}


