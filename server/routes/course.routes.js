import express from 'express';
import isAuthenticated from '../middleware/isAuthenticated.js';
import { createCourse, createLectures, editCourse, getAllCourses, getAllLectures, getCourseById } from '../controllers/course.controller.js';
import upload from "../utils/multer.js";

const router = express.Router();

router.route("/").post(isAuthenticated, createCourse);
router.route("/all").get(isAuthenticated, getAllCourses);
router.route("/edit/:courseID").put(isAuthenticated, upload.single("courseThumbnail"), editCourse);
router.route("/:courseID").get(isAuthenticated, getCourseById);
router.route("/:courseID/lectures").post(isAuthenticated, createLectures);
router.route("/:courseID/lectures").get(isAuthenticated, getAllLectures);



export default router;
