import mongoose from "mongoose";

const connectDB = async ()=> {
    return await mongoose.connect(`${process.env.DBURL}`)
    .then(()=>{
        console.log(`connectDB......... at ${process.env.DBURL}`);
    })
}
export default connectDB