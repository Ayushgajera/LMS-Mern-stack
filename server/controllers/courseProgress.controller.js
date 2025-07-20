import CourseProgress from "../models/courseProgress.model.js";
import { Course } from "../models/course.model.js";
import { User } from "../models/user.model.js"

export const getCourseProgress = async (req, res) => {
    try {
      const { courseId } = req.params;
      const userId = req.id;
  
      // 🔐 Check if user is enrolled in the course
      const user = await User.findById(userId);
      const hasEnrolled = user.enrolledCourses.some(
        (enrolledId) => enrolledId.toString() === courseId
      );
  
      if (!hasEnrolled) {
        return res.status(403).json({ message: "Access denied. Please enroll in the course." });
      }
  
      // ✅ Fetch course progress
      let courseProgress = await CourseProgress.findOne({ userId, courseId }).populate("courseId");
  
      const courseDetails = await Course.findById(courseId).populate("lectures");
      if (!courseDetails) {
        return res.status(404).json({ message: "Course not found" });
      }
  
      if (!courseProgress) {
        return res.status(200).json({
          data: {
            courseDetails,
            progress: [],
            completed: false,
          },
        });
      }
  
      return res.status(200).json({
        data: {
          courseDetails,
          progress: courseProgress.lectureProgress,
          completed: courseProgress.completed,
        },
      });
    } catch (error) {
      console.error("Error fetching course progress:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };

export const updateCourseProgress = async (req, res) => {
    try {
        const { courseId, lectureId } = req.params;
        const userId = req.id;

        // Find or create course progress for the user
        let courseProgress = await CourseProgress.findOne({ userId, courseId });

        if (!courseProgress) {
            // If no progress exists, create a new record
            courseProgress = new CourseProgress({
                userId,
                courseId,
                lectureProgress: [],
                completed: false
            });
        }

        // Find the lecture progress in the course progress
        const lectureIndex = courseProgress.lectureProgress.findIndex(lp => lp.lectureId === lectureId);

        if (lectureIndex !== -1) {
            courseProgress.lectureProgress[lectureIndex].viewed = true;
        } else {
            // Add new lecture progress
            courseProgress.lectureProgress.push({ lectureId, viewed: true });
        }

        // Check if all lectures are viewed to mark the course as completed
        // You may want to check against actual lectures in the course for a robust solution
        const allLecturesViewed = courseProgress.lectureProgress.every(lp => lp.viewed);
        if (allLecturesViewed) {
            courseProgress.completed = true;
        }

        await courseProgress.save();

        res.status(200).json({
            message: "Course progress updated successfully",
            data: {
                completed: courseProgress.completed,
                progress: courseProgress.lectureProgress
            }
        });
    } catch (error) {
        console.error("Error updating course progress:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const markAsCompleted = async (req, res) => {
    try {
        const { courseId } = req.params;
        const userId = req.id;

        // Find the course progress for the user
        let courseProgress = await CourseProgress.findOne({ userId, courseId });

        if (!courseProgress) {
            return res.status(404).json({ message: "Course progress not found" });
        }

        courseProgress.lectureProgress.forEach(lp => {
            lp.viewed = true;
        });

        // Mark the course as completed
        courseProgress.completed = true;
        await courseProgress.save();

        res.status(200).json({
            message: "Course marked as completed",
            data: {
                completed: courseProgress.completed,
                progress: courseProgress.lectureProgress
            }
        });
    } catch (error) {
        console.error("Error marking course as completed:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const markAsInCompleted = async (req, res) => {
    try {
        const { courseId } = req.params;
        const userId = req.id;

        // Find the course progress for the user
        let courseProgress = await CourseProgress.findOne({ userId, courseId });

        if (!courseProgress) {
            return res.status(404).json({ message: "Course progress not found" });
        }

        courseProgress.lectureProgress.forEach(lp => {
            lp.viewed = false;
        });

        // Mark the course as incomplete
        courseProgress.completed = false;
        await courseProgress.save();

        res.status(200).json({
            message: "Course marked as incomplete",
            data: {
                completed: courseProgress.completed,
                progress: courseProgress.lectureProgress
            }
        });
    } catch (error) {
        console.error("Error marking course as incomplete:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};