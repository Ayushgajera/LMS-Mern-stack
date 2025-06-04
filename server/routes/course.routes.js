import express from 'express';
import isAuthenticated from '../middleware/isAuthenticated.js';
import { createCourse, getAllCourses } from '../controllers/course.controller.js';

const router = express.Router();

router.route("/").post(isAuthenticated, createCourse);
router.route("/").get(isAuthenticated, getAllCourses);



export default router;
