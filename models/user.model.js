import mongoose from 'mongoose'
import bcrypt from 'bcrypt'


const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, "User name is required"],
        minLength: 3,
        maxLength: 60,
    },
    email:{
        type:String,
        required:[true, "User email is required"],
        lowercase: true,
        trim: true,
        match:[
            /^[a-z0-9._%+-]+@gmail\.com$/, 
            'Please fill a valid Gmail address'
        ]
    },
    password:{
        type:String,
        required: [true, "Password is required"],
        minLength: [8, 'Password must be at least 8 characters'],
        maxLength: [15, 'Password must not be more than 15 characters'],
        select: false,
        match: [
            /^(?=(?:.*[A-Za-z]){4,})(?=(?:.*\d){2,})(?=(?:.*[^A-Za-z0-9]){1,}).{8,15}$/,
            'Password must have at least 4 letters, 2 numbers, and 1 special character',
        ],
    },
    userId:{
        type: String,
        required: [true, "User ID is required"],
        unique: true,
        uppercase: true,
        trim: true,
    },

    role:{
        type:String,
        enum : ["manager", "engineer"],
        required: true,
    },

    createdBy:{
        type:String,
        default: null
    }
}, {timestamps:true})

userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});


userSchema.methods.comparePassword = async function(candidatePassword){
    return await bcrypt.compare(candidatePassword, this.password);
}

export default mongoose.model('User', userSchema);