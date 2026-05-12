import { Worker } from 'bullmq'
import transporter from '../config/nodemailer.js'
import { getDeadlineEmail } from '../templates/email_template.js'
import { REDIS_URL } from '../config/env.js'

const connection = {
    host : new URL(REDIS_URL).hostname,
    port : parseInt(new URL(REDIS_URL).port),
    password : new URL(REDIS_URL).password,
    username : new URL(REDIS_URL).username
}

const emailWorker = new Worker('emailQueue', async(job) =>{
    const { to, name, taskTitle , deadline } = job.data

    const htmlBody = getDeadlineEmail({
        title : taskTitle,
        deadline,
        assignedTo: { name }
    })
    await transporter.sendMail({
        from: '"Task Manager <rainaarav05@gmail.com>"',
        to,
        subject : `⏰ 2-Day Warning: ${taskTitle}`,
        html : htmlBody
    })

    console.log(`[Worker] Email sent to : ${to}`)

}, {
    connection,
    attempts : 3,
    backoff : {
        type : 'exponential',
        delay : 5000
    }
})

emailWorker.on('completed', (job) =>{
    console.log(`[Worker] Job ${job.id} completed`)
})

emailWorker.on('failed', (job, err) =>{
    console.log(`[Worker] Job ${job.id} failed`, err.message)
})

export default emailWorker
