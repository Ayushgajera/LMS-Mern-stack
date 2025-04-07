import express from 'express';
import dotenv from 'dotenv';
import connectDB from "./db/db.js";
import userRouter  from "./routes/user.routes.js";


dotenv.config();
const app=express();
const PORT=process.env.PORT||8000;
// database connection
connectDB();
app.use("/api/v1/user",userRouter)

app.listen(PORT,()=>{
    console.log(`server listening on port ${PORT}`);
    
})