import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    firstName : {
        type : String,
        required : true
    },
    lastName : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true
    },
    confirmEmail: {
        type : Boolean,
        default : false
    },
    age : Number,
    phone : String,
    isOnline : {
        type : Boolean,
        default : false
    },
    lastSeen : Date,
    deletedAt: {
        type : Boolean,
        default : true
    }
}, {
    timestamps : true
})
const userModel = mongoose.model('User', userSchema)
export default userModel