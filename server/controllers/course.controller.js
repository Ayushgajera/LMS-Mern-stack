import { Course } from "../models/course.model.js";
import { deleteMedia, uploadMedia } from "../utils/cloudinary.js";
import Lecture from "../models/lecture.model.js";

export const createCourse = async (req, res) => {
    try {

        const { courseTitle, category } = req.body;

        if (!courseTitle || !category) {
            return res.status(400).json({ message: "Course title and category are required." });
        }
        const course = await Course.create({
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
        const userId = req.id;
        if (!userId) {
            return res.status(400).json({ message: "User ID is missing from request." });
        }
        const courses = await Course.find({ creator: userId });
        if (!courses.length) {
            return res.status(200).json({
                courses: [],
                message: "No courses found for this user.",
            });
        }

        return res.status(200).json({
            courses,
            message: "Courses fetched successfully",
        });
    } catch (error) {
        console.error("Error fetching courses:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const editCourse = async (req, res) => {
    try {
        const courseId = req.params.courseID;

        const { courseTitle, subTitle, courseDescription, category, courseLevel, coursePrice } = req.body;
        const thumbnail = req.file;


        let course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: "Course not found." });
        }
        let courseThumbnail;
        if (thumbnail) {
            if (course.courseThumbnail) {
                const publicId = course.courseThumbnail.split("/").pop().split(".")[0];
                await deleteMedia(publicId);
            }
            courseThumbnail = await uploadMedia(thumbnail.path);

        }
        const updateData = { courseTitle, subTitle, courseDescription, category, courseLevel, coursePrice, courseThumbnail: courseThumbnail?.secure_url }


        course = await Course.findByIdAndUpdate(courseId, updateData, { new: true });

        return res.status(200).json({
            course,
            message: "Course updated successfully"
        });
    } catch (error) {
        console.error("Error updating course:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const getCourseById = async (req, res) => {
    try {
        const courseId = req.params.courseID;
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: "Course not found." });
        }
        res.status(200).json({
            course,
            message: "Course fetched successfully",
        });
    } catch (error) {
        console.error("Error fetching course:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
export const createLectures = async (req, res) => {
    try {
        const courseId = req.params.courseID;
        const { lectureTitle } = req.body;
        if (!courseId) {
            return res.status(400).json({ message: "Course ID is required." });
        }

        if (!lectureTitle) {
            return res.status(400).json({ message: "Lecture title is required." });
        }
        const lecture = await Lecture.create({ lectureTitle });
        const course = await Course.findById(courseId);
        if (course) {
            course.lectures.push(lecture._id);
            await course.save();

        }


        return res.status(201).json({
            course,
            message: "Lecture created successfully"
        });
    } catch (error) {
        console.error("Error creating lecture:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
export const getAllLectures = async (req, res) => {
    try {
        const courseId = req.params.courseID;
        if (!courseId) {
            return res.status(400).json({ message: "Course ID is required." });
        }
        const course = await Course.findById(courseId).populate('lectures');
        if (!course) {
            return res.status(404).json({ message: "Course not found." });
        }
        return res.status(200).json({
            lectures: course.lectures,
            message: "Lectures fetched successfully"
        });
    } catch (error) {
        console.error("Error fetching lectures:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
export const editLecture = async (req, res) => {
    try {
        const {lectureTitle,videoInfo,ispreview} = req.body;
        
        
    } catch (error) {
        console.error("Error updating lecture:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
export const deleteLecture = async (req, res) => {
    
}