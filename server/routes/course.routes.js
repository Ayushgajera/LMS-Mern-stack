import express from 'express';
import isAuthenticated from '../middleware/isAuthenticated.js';
import { createCourse, createLectures, editCourse, editLecture, getAllCourses, getAllLectures, getCourseById, getLectureById, removeLecture } from '../controllers/course.controller.js';
import upload from "../utils/multer.js";

const router = express.Router();

router.route("/").post(isAuthenticated, createCourse);
router.route("/all").get(isAuthenticated, getAllCourses);
router.route("/edit/:courseID").put(isAuthenticated, upload.single("courseThumbnail"), editCourse);
router.route("/:courseID").get(isAuthenticated, getCourseById);
router.route("/:courseID/lectures").post(isAuthenticated, createLectures);
router.route("/:courseID/lectures").get(isAuthenticated, getAllLectures);
router.route("/:courseID/lectures/:lectureID").put(isAuthenticated, editLecture);
router.route("/:courseID/lectures/:lectureID").delete(isAuthenticated, removeLecture);
router.route("/:courseID/lectures/:lectureID").get(isAuthenticated, getLectureById);



export default router;
