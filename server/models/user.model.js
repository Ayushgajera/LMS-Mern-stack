import mongoose from "mongoose";    
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    }
    ,
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:["instructor","student"],
        default:'student'
    },
    enrolledCourses:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Course",

        }
    ],
    photoUrl:{
        type:String,
        default:"",

    },
    onboardedAsInstructor: {
      type: Boolean,
      default: false,
    },
    instructorOnboardingAnswers: {
      type: [String], // or [{question: String, answer: String}] for more detail
      default: [],
    },
},{timestamps: true},);


export const User = mongoose.model("User", userSchema);
