// controllers/paymentController.js
import Razorpay from "razorpay";
import dotenv from "dotenv";
import crypto from "node:crypto";
import { PurchaseCourse } from "../models/purchaseCourse.model.js";
import { Course } from "../models/course.model.js";
import { User } from "../models/user.model.js"

dotenv.config();

export const createPurchase = async (req, res) => {
    const { amount } = req.body;

    if (!amount) {
        return res.status(400).json({ error: "Amount is required" });
    }

    const razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_SECRET,
    });

    const options = {
        amount: amount * 100, // ₹ to paisa
        currency: "INR",
        receipt: `receipt_${Date.now()}`,
        payment_capture: 1,
    };

    try {
        const order = await razorpay.orders.create(options);
        res.json({
            success: true,
            orderId: order.id,
            amount: order.amount / 100,
            message: "Order created successfully",
        });
    } catch (err) {
        console.error("Create Order Error:", err);
        res.status(500).json({ error: "Order creation failed" });
    }
};

export const verifyPayment = async (req, res) => {
    const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        courseId,
        userId,
        amount,
    } = req.body;

    console.log("Incoming verification request:", req.body);

    if (
        !razorpay_order_id ||
        !razorpay_payment_id ||
        !razorpay_signature ||
        !courseId ||
        !userId ||
        amount === undefined
    ) {
        console.log("Missing field in payment verification:", {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            courseId,
            userId,
            amount,
        });
        return res.status(400).json({ error: "Missing required fields" });
    }

    try {
        const generatedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_SECRET)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest("hex");

        if (generatedSignature !== razorpay_signature) {
            return res.status(400).json({ error: "Invalid signature" });
        }

        // 💳 Save purchase record
        const purchase = new PurchaseCourse({
            courseId,
            userId,
            amount,
            status: "completed",
            paymentId: razorpay_payment_id,
        });

        await purchase.save();

        // ✅ Enroll user in course
        const user = await User.findById(userId);

        if (!user.enrolledCourses.includes(courseId)) {
            user.enrolledCourses.push(courseId);
            await user.save();
        }

        res.json({
            success: true,
            message: "Payment verified, course enrolled, and purchase saved",
            purchase,
        });
    } catch (err) {
        console.error("Payment verification error:", err);
        res.status(500).json({ error: "Server error during verification" });
    }
};

export const getUserPurchases = async (req, res) => {
    // Accept courseId and userId from query or params for flexibility
    const courseId = req.query.courseId || req.params.courseId;
    const userId =req.id;
    console.log(courseId,userId)

    // Validate ObjectIds
    if (!courseId || !userId) {
        return res.status(400).json({ error: "Invalid courseId or userId" });
    }

    try {
        // Find the course and check if purchased
        const course = await Course.findById(courseId)
            .populate({ path: 'creator' })
            .populate({ path: "lectures" });

        if (!course) {
            return res.status(404).json({ error: "Course not found" });
        }

        const purchased = await PurchaseCourse.findOne({ userId, courseId });

        res.json({
            success: true,
            course,
            purchased: !!purchased // true if purchased, false otherwise
        });
    } catch (err) {
        console.error("Error fetching user purchases:", err);
        res.status(500).json({ error: "Server error fetching purchases" });
    }
};

