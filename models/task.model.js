import mongoose from 'mongoose';
import { calculatePriority } from '../utils/priority.js';

const taskSchema = new mongoose.Schema({
    title:{
        type:String,
        required:[true, 'Task title is required'],
        trim: true,
        minLength: 3,
        maxLength: 50,
    },
    description:{
        type:String, 
        required:[true , 'Task description is required'],
        trim: true,
        minLength: 5,
        maxLength: 120,
    },
    status:{
        type: String,
        enum: ['pending', 'in-progress', 'completed'],
        default:'pending'
    },

    deadline:{
        type: Date,
        required : true
    },

    importance: {
        type: String,
        required : [true, 'Task importance is required'],
        enum : ['high', 'medium', 'low']
    },

    priorityScore: {
        type : Number
    },
    assignedTo:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    reminderSent:{
        type: Boolean,
        default:false
    }

},  {timestamps:true})


taskSchema.pre('save', function(){
    this.priorityScore = calculatePriority(this);
})

export default mongoose.model('Task', taskSchema);