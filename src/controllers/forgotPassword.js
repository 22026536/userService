import bcryptjs from "bcryptjs";
import dotenv from "dotenv";
import nodemailer from 'nodemailer';
import User from '../models/User.js'; // Mongoose User model
dotenv.config();

export const forgotPassword = async (req, res) => {
    try {
        const userEmail = req.body.gmail;

        // Generate a random verification token
        const token = Math.floor(10000 + Math.random() * 90000).toString();
        const expireToken = new Date(Date.now() + 600000);
        const hashedToken = await bcryptjs.hash(token, 11);

        // Check if the user exists
        const user = await User.findOne({ email: userEmail });
        if (!user) {
            return res.status(404).json({
                message: 'Cannot find the user',
                success: false
            });
        }

        // Update user's reset token and expiration
        user.reset_token = hashedToken;
        user.reset_token_expire = expireToken;
        await user.save();

        // Send verification email
        const transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: process.env.MAIL_PORT,
            service: 'gmail',
            secure: false,
            auth: {
                user: process.env.MY_EMAIL,
                pass: process.env.MY_EMAIL_PASSWORD
            }
        });

        const mailOptions = {
            from: process.env.MY_EMAIL,
            to: userEmail,
            subject: 'Token',
            text: `Your Token is: ${token}. will be expired in 10 minutes.`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return res.json({
                    message: error.message,
                    success: false
                });
            }
            return res.json({
                message: 'Token has been send to the email',
                success: true
            });
        });
    } catch (error) {
        res.json({ message: error.message, success: false });
    }
};

export const forgotPasswordCheck = async (req, res) => {
    try {
        const userEmail = req.body.gmail;  // Lấy email từ session
        const user = await User.findOne({ email: userEmail });

        if (!user) {
            return res.json({
                message: "Cannot find the user",
                success: false
            });
        }

        // Check token expiration
        const expireToken = new Date(user.reset_token_expire);
        if (new Date() > expireToken) {
            return res.json({ message: "token has been expired", success: false });
        }

        // Compare tokens
        const isMatch = await bcryptjs.compare(req.body.token, user.reset_token);
        if (!isMatch) {
            return res.json({
                message: "Token not correct",
                success: false
            });
        }
        
        return res.json({
            message: "Correct",
            success: true
        });
    } catch (error) {
        return res.json({ message: error.message, success: false });
    }
};

export const forgotPasswordChangePassword = async (req, res) => {
    try {
        const newPassword = req.body.password;
        const reNewPassword = req.body.rePassword;
        const userEmail = req.body.gmail;  // Lấy email từ session
        if (newPassword !== reNewPassword) {
            return res.json({
                message: "repassword not correct",
                success: false
            });
        }

        const hashedPassword = await bcryptjs.hash(newPassword, 11);

        const user = await User.findOneAndUpdate(
            { email: userEmail },
            { password: hashedPassword, reset_token: null, reset_token_expire: null },
            { new: true }
        );

        if (!user) {
            return res.json({
                message: "Cannot find the user",
                success: false
            });
        }

        res.json({
            message: "Change password successful",
            success: true
        });
    } catch (error) {
        res.json({ message: error.message, success: false });
    }
};