import bcryptjs from "bcryptjs";
import dotenv from "dotenv";
import User from "../models/User.js"; // Import the Mongoose model
import { singUpValidator } from "../validation/user.js";

dotenv.config();
const SECRET_CODE = process.env.SECRET_CODE;

const signUp = async (req, res) => {
    try {
        // Step 1: Validate data
        const { error } = singUpValidator.validate(req.body, { abortEarly: false });
        if (error) {
            return res.json({
                message: error.details[0].message,
                success: false
            });
        }

        // Check if username already exists
        const usernameExists = await User.findOne({ username: req.body.user__name });
        if (usernameExists) {
            return res.json({
                message: "username existed",
                success: false
            });
        }

        // Check if phone number already exists
        const phoneExists = await User.findOne({ phone_number: req.body.phone__number });
        if (phoneExists) {
            return res.json({
                message: "phone number existed",
                success: false
            });
        }

        // Check if email already exists
        const emailExists = await User.findOne({ email: req.body.gmail });
        if (emailExists) {
            return res.json({
                message: "gmail existed",
                success: false
            });
        }

        // Hash the password
        const hashedPassword = await bcryptjs.hash(req.body.password, 11);
        const sex = req.body.sex ;

        // Add user to the database
        const newUser = new User({
            full_name: req.body.name,
            phone_number: req.body.phone__number,
            email: req.body.gmail,
            date_of_birth: req.body.birthday,
            sex: sex,
            password: hashedPassword,
            user_name: req.body.user__name,
            japanese_level: req.body.level
        });
        
        await newUser.save();

        // Clear password before sending the response
        req.body.password = undefined;
        res.json({
            message: "Successful",
            success: true
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            message: "Đã xảy ra lỗi",
            success: false
        });
    }
};

export default signUp;