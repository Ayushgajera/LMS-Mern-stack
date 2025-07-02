import { Course } from "../models/course.model.js";
import { User } from "../models/user.model.js"
import { deleteMedia, deletevideo, uploadMedia } from "../utils/cloudinary.js";
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
        console.log("Updated course:", course);
        // Access io from app
        const io = req.app.get("io");

        // Emit real-time update to all users
        io.emit("courseUpdated", course);
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
        const course = await Course.findById(courseId).populate("creator", "name email photoUrl").populate("lectures");

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
export const removeCourse = async (req, res) => {
    try {
        const courseId = req.params.courseID;
        const course = await Course.findByIdAndDelete(courseId);
        if (!course) {
            return res.status(404).json({ message: "Course not found." });
        }
        //delete the course thumbnail from cloudinary
        if (course.courseThumbnail) {
            const publicId = course.courseThumbnail.split("/").pop().split(".")[0];
            await deleteMedia(publicId);
        }
        //remove all lectures associated with the course
        await Lecture.deleteMany({ _id: { $in: course.lectures } }); // always $in operator pachi array hovo joy

        return res.status(200).json({
            message: "Course removed successfully"
        });
    } catch (error) {
        console.error("Error removing course:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}


//lectures controller
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
        const { lectureTitle, secure_url, ispreview, public_id } = req.body;
        console.log(secure_url)
        const lectureId = req.params.lectureID;

        if (!lectureId) {
            return res.status(400).json({ message: "Lecture ID is required." });
        }

        const lecture = await Lecture.findById(lectureId);
        if (!lecture) {
            return res.status(404).json({ message: "Lecture not found." });
        }

        lecture.lectureTitle = lectureTitle || lecture.lectureTitle;
        lecture.videoUrl = secure_url || lecture.secure_url;
        lecture.publicID = public_id || lecture.publicID;
        lecture.isPreview = ispreview !== undefined ? ispreview : lecture.isPreview;

        await lecture.save();

        const course = await Course.findOne({ lectures: lectureId });
        if (course && !course.lectures.includes(lectureId)) {
            course.lectures.push(lectureId);
            await course.save();
        }


        return res.status(200).json({
            lecture,
            message: "Lecture updated successfully"
        });
    } catch (error) {
        console.error("Error updating lecture:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
export const getLectureById = async (req, res) => {
    try {
        const lectureId = req.params.lectureID;
        const courseId = req.params.courseID;

        if (!lectureId) {
            return res.status(400).json({ message: "Lecture ID is required." });
        }
        const lecture = await Lecture.findById(lectureId);
        if (!lecture) {
            return res.status(404).json({ message: "Lecture not found." });
        }
        return res.status(200).json({
            lecture,
            message: "Lecture fetched successfully"
        });

    } catch (error) {

    }
}
export const removeLecture = async (req, res) => {
    try {
        const { lectureID } = req.params;
        const lecture = await Lecture.findByIdAndDelete(lectureID);
        console.log(lecture);
        if (!lecture) {
            return res.status(404).json({ message: "Lecture not found." });
        }
        //delete the lecture video from cloudinary
        console.log(lecture.publicID);
        if (lecture.publicID) {
            console.log("deleting video");
            await deletevideo(lecture.publicID);



        }
        // remove lecture refrenece from the associated course
        await Course.updateOne(
            { lectures: lectureID }, // find the course that has the lecture
            { $pull: { lectures: lectureID } }); //remove the lecture the lecture array

        return res.status(200).json({
            message: "Lecture removed successfully"
        });

    } catch (error) {
        console.error("Error removing lecture:", error);
        res.status(500).json({ message: "failed to remove lecture" });
    }
}

export const publishCourse = async (req, res) => {
    try {
        const { courseID } = req.params;
        const { publish } = req.query; // true or false
        const course = await Course.findById(courseID);
        if (!course) {
            return res.status(404).json({ message: "Course not found." });
        }
        course.ispublished = publish === "true";
        await course.save();
        const statusMessage = course.ispublished ? "published" : "unpublished";

        // ✅ Emit real-time update to all users
        const io = req.app.get("io");
        io.emit("courseUpdated", course);

        return res.status(200).json({
            course,
            message: `Course is ${statusMessage} successfully`
        });
    } catch (error) {
        console.error("Error updating course:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
export const getPublishCourse = async (req, res) => {
    try {
        const courses = await Course.find({ ispublished: true }).populate("creator", "name email photoUrl");
        console.log(courses);

        if (courses.length === 0) {
            return res.status(404).json({ message: "No published courses found." });
        }

        return res.status(200).json({
            courses,
            message: "Published courses fetched successfully"
        });
    } catch (error) {
        console.error("Error fetching published courses:", error);
        res.status(500).json({ message: "Failed to fetch published courses." });
    }
};
