import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken.js";
import { deleteMedia, uploadMedia } from "../utils/cloudinary.js";




export const register = async (req, res) => {

    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashpassword = await bcrypt.hash(password, 10);
        await User.create({ name, email, password: hashpassword });

        return res.status(201).json(
            {
                success: true,
                message: "Account created successfully",

            }
        )

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "failed to register"
        })
    }
};

export const login = async (req, res) => {

    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Incorrect email or password"
            });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Incorrect email or password"
            })
        }
        generateToken(res, user, `Welcome ${user.name}`)

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "failed to register"
        })
    }


}
export const logout = async (_, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: true, 
            sameSite: "Strict", 
        });
        return res.status(200).json({
            success: true,
            message: "Logged out successfully"
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to logout"
        });
    }
};

export const getUserProfile = async (req, res) => {
    try {
        const userId=req.id;
        const user= await User.findById(userId).select("-password");
        if(!user){
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }
        return res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        console.log(error);``
        return res.status(500).json({
            success: false,
            message: "failed to logout"
        })
    }
}
export const updateUserProfile = async (req, res) => {
    try {
        const userId = req.id;
        const { name, email } = req.body;
        const profilephoto = req.file;
         console.log(req.file); // make sure file is received
  console.log(req.body);

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Initialize update object with basic fields
        const updatedUser = { name, email };


        // Handle photo update only if a new file is uploaded
        if (profilephoto) {
            try {
                // Delete old photo if it exists
                if (user.photoUrl) {
                    const publicId = user.photoUrl.split("/").pop().split(".")[0];
                    await deleteMedia(publicId);
                }

                // Upload new photo
                const cloudResponse = await uploadMedia(profilephoto.path);
                
                updatedUser.photoUrl = cloudResponse.secure_url;

            } catch (uploadError) {
                return res.status(400).json({
                    success: false,
                    message: "Failed to update profile photo"
                });
            }
        }

        // Update user in database
        const updatedUserData = await User.findByIdAndUpdate(
            userId,
            updatedUser,
            { new: true }
        ).select("-password");

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user: updatedUserData
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to update profile"
        });
    }
};
