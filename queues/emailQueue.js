import { Queue } from 'bullmq'
import { REDIS_URL } from '../config/env.js'

const connection = {
    host : new URL(REDIS_URL).hostname,
    port : parseInt(new URL(REDIS_URL).port),
    password : new URL(REDIS_URL).password,
    username: new URL(REDIS_URL).username,

}



export const emailQueue  = new Queue('emailQueue', { connection })


