import express from 'express';
import isAuthenticated from '../middleware/isAuthenticated.js';
import { createCourse, editCourse, getAllCourses, getCourseById } from '../controllers/course.controller.js';
import upload from "../utils/multer.js"; 

const router = express.Router();

router.route("/").post(isAuthenticated, createCourse);
router.route("/all").get(isAuthenticated, getAllCourses);
router.route("/edit/:courseID").put(isAuthenticated,upload.single("courseThumbnail"), editCourse);
router.route("/:courseID").get(isAuthenticated, getCourseById);



export default router;
