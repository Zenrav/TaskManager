import express from 'express';
import tasksRouter from './routes/tasks.route.js';
import userRouter from './routes/user.route.js';
import connectToDatabase from './database/mongodb.js';
import authRouter from './routes/auth.route.js';
import { runDeadlineCheck } from './utils/cronlogic.js';
import cron from 'node-cron';
import './config/redis.js';
import './queues/emailWorker.js'
const app = express();
const port = 3000;

app.use(express.json())
app.use('/api', tasksRouter);
app.use('/api', userRouter);
app.use('/api', authRouter);

app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal server error'
    })
})
cron.schedule('* * * * *', () =>{
    console.log('Checking deadlines...');
    runDeadlineCheck();
});

app.listen(port, async () =>{
    console.log(`Server is running on port ${port}`);
    await connectToDatabase();
})