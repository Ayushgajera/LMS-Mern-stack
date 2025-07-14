import express from 'express';
import isAuthenticated from '../middleware/isAuthenticated.js';
import { createCourse, createLectures, editCourse, editLecture, getAllCourses, getAllLectures, getCourseById, getLectureById, getPublishCourse, publishCourse, removeCourse, removeLecture } from '../controllers/course.controller.js';
import upload from "../utils/multer.js";
import { getUserPurchases } from '../controllers/purchaseCourse.controller.js';

const router = express.Router();

router.route("/").post(isAuthenticated, createCourse);
router.route("/publishCourse").get(getPublishCourse);
router.route("/all").get(isAuthenticated, getAllCourses);
router.route("/edit/:courseID").put(isAuthenticated, upload.single("courseThumbnail"), editCourse);

// Dynamic routes LAST
router.route("/:courseID").get(getCourseById);
router.route("/:courseID").delete(isAuthenticated, removeCourse);
router.route("/:courseID").patch(isAuthenticated, publishCourse);
router.route("/:courseID/lectures").post(isAuthenticated, createLectures);
router.route("/:courseID/lectures").get(isAuthenticated, getAllLectures);
router.route("/:courseID/lectures/:lectureID").put(isAuthenticated, editLecture);
router.route("/:courseID/lectures/:lectureID").delete(isAuthenticated, removeLecture);
router.route("/:courseID/lectures/:lectureID").get(isAuthenticated, getLectureById);
router.route("/:courseId/purchase").get(isAuthenticated, getUserPurchases);



export default router;
