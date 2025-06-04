import { Course } from "../models/course.model.js";

export const createCourse = async (req, res) => {
    try {
        
        const { courseTitle,category} = req.body;

        if(!courseTitle || !category) {
            return res.status(400).json({ message: "Course title and category are required." });
        }
        const course= await Course.create({
            courseTitle,
            category,
            creator: req.id
        })
        return res.status(201).json({
            course,
            message: "Course created successfully"
        })

        // Validate required fields
        if (!courseTitle || !category || !coursePrice) {
            return res.status(400).json({ message: "Course title, category, and price are required." });
        }

        // Create a new course instance
        const newCourse = new Course({
            courseTitle,
            subTitle,
            courseDescription,
            category,
            courseLevel,
            coursePrice,
            courseThumbnail,
            creator: req.user._id // Assuming user ID is available in req.user
        });

        // Save the course to the database
        await newCourse.save();

        res.status(201).json({ message: "Course created successfully", course: newCourse });
        
    } catch (error) {
        console.error("Error creating course:", error);
        res.status(500).json({ message: "Internal server error" });
        
    }
}
export const getAllCourses = async (req, res) => {
    try {
        const UserID=req.id;
        const courses = await Course.find({creator: UserID})
        if (!courses || courses.length === 0) {
            return res.status(404).json({ message: "No courses found for this user." });
        }
        res.status(200).json({
            courses,
            message: "Courses fetched successfully",
        });
    } catch (error) {
        console.error("Error fetching courses:", error);
        res.status(500).json({ message: "Internal server error" });
    }   
}