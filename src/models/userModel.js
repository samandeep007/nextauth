import mongoose from 'mongoose';
const userSchema = new mongoose.Schema({
username: {
    type: String,
    required: [true, 'Please provide a username'],
    unique: [true, 'Username already exists'],
},
email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: [true, 'Email already exists'],
},

password: {
    type: String,
    required: [true, 'Please provide a password'],
},
isVerified: {
    type: Boolean,
    default: false,
},

isAdmin: {
    type:Boolean,
    default: false
},

forgotPasswordToken: String,  // this will be sent to the user's email and will be used to reset the password
forgotPasswordTokenExpiry: Date, 
verifyToken: String,
verifyTokenExpiry: Date

},{timestamps: true});


const User = mongoose.models.users || mongoose.model('users', userSchema); // if the model is already created, use it, else create a new one

export default User;