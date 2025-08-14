import express from 'express';
import { register, login, getUserProfile, logout, updateUserProfile, revertToStudent } from '../controllers/user.controller.js';
import isAuthenticated from '../middleware/isAuthenticated.js'; import upload from '../utils/multer.js';
import {authorizeRoles} from '../middleware/authorizeRoles.js'
// server/routes/user.routes.js
import { setInstructorOnboarded, getInstructorOnboarded } from '../controllers/user.controller.js';
import { User } from '../models/user.model.js';
const router = express.Router();


router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").get(isAuthenticated, logout);
router.route("/profile").get(isAuthenticated, getUserProfile);
router.route("/profile/update").put(isAuthenticated, upload.single('profilephoto'), updateUserProfile);
router.post('/instructor-onboard', isAuthenticated, setInstructorOnboarded);
router.get('/instructor-onboard', isAuthenticated, getInstructorOnboarded);
router.patch('/become-student', isAuthenticated, revertToStudent);
router.get("/me", isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});



export default router;
