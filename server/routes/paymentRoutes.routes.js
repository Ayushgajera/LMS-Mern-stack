import express from "express";
import Razorpay from "razorpay";
import dotenv from "dotenv";
import { createPurchase, getUserPurchases, verifyPayment } from "../controllers/purchaseCourse.controller.js";

dotenv.config();
const router = express.Router();



// Pass razorpay instance to controller via closure
router.route("/create-order").post(createPurchase);
router.route("/verify").post(verifyPayment);
router.route("/:courseId/purchase").get(getUserPurchases);
export default router;