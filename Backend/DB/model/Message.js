import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    text : {
        type : String,
        required : true
    },
    recievedId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true
    }
}, {
    timestamps : true
})
const messageModel = mongoose.model('Message', messageSchema)
export default messageModel