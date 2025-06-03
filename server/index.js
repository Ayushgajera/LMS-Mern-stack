import express from 'express';
import dotenv from 'dotenv';
import connectDB from "./db/db.js";
import userRouter  from "./routes/user.routes.js";
import courseRouter from "./routes/course.routes.js";
import cookieParser from 'cookie-parser';
import cors from 'cors';

const app=express();
dotenv.config();
// middleware
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use(cors({
    origin:"http://localhost:4173",
    credentials:true,
    
}))

const PORT=process.env.PORT||8000;
// database connection
connectDB();

//api routes
app.use("/api/v1/user",userRouter)
app.use("/api/v1/course",courseRouter)

app.listen(PORT,()=>{
    console.log(`server listening on port ${PORT}`);
    
})