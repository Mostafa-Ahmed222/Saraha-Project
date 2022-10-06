import dotenv from "dotenv"
dotenv.config()
import express from "express"
import connectDB from "./DB/connect.js"
import * as indexRouter from "./modules/index.router.js"
const app = express()
const port = 3000
app.use(express.json())
app.use(`${process.env.BasedUrl}/auth`, indexRouter.authRouter)
app.use(`${process.env.BasedUrl}/user`, indexRouter.userRouter)
app.use(`${process.env.BasedUrl}/message`, indexRouter.messageRouter)
app.use('*', (req, res)=>{
    res.json({ message: "Error 404 Page Not Found" });
})

connectDB()
app.listen(port, ()=> {
    console.log(`server is running..... at port ${port}`);
})