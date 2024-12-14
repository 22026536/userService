import bcryptjs from "bcryptjs";
import dotenv from "dotenv";
import { createJWT } from "../middlewares/JWT.js";
import User from "../models/User.js"; // Import the Mongoose model
import { signInValidator } from "../validation/user.js";

dotenv.config();
const SECRET_CODE = process.env.SECRET_CODE;

const login = async (req, res) => {
    try {
        // Step 1: Validate client data
        const { error } = signInValidator.validate(req.body, { abortEarly: false });
        if (error) {
            const errors = error.details.map(err => err.message);
            return res.json({
                message: error.details[0].message,
                success: false
            });
        }

        // Step 2: Check if the username exists
        const user = await User.findOne({ user_name: req.body.user__name });
        if (!user) {
            return res.json({
                message: "Username not exist",
                success: false
            });
        }

        // Step 3: Check if the password is correct
        const isMatch = await bcryptjs.compare(req.body.password, user.password);
        if (!isMatch) {
            return res.json({
                message: "Password not correct",
                success: false
            });
        }

        // Step 4: Create JWT
        let payload = {
            id: user.user_id,
        };
        const token = createJWT(payload);
        if (user.role === 0) {
            return res.json({
                message: "user",
                success: true,
                jwt: token,
            });
        } else {
            return res.json({
                message: "admin",
                success: true,
                jwt: token,
            });
        }

    } catch (error) {
        return res.status(500).json({
            name: error.name,
            message: error.message
        });
    }
};

export default login;