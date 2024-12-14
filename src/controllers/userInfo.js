import dotenv from 'dotenv';
import { isTokenExpired, verifyToken } from '../middlewares/JWT.js';
import User from '../models/User.js'; // Model MongoDB cho bảng users
dotenv.config();

// Lấy thông tin người dùng
export const userInfo = async (req, res) => {
    try {
        const token = req.body.jwt
        if (!token) {
            return res.json({
                message: "Người dùng chưa đăng nhập",
                success: false
            });
        }

        if (isTokenExpired(token)) {
            return res.json({
                message: "Người dùng hết phiên đăng nhập",
                success: false
            });
        }

        const decoded = verifyToken(token);
        const user_id = decoded.id;
        // Tìm người dùng bằng user_id trong MongoDB
        const user = await User.findOne({ user_id: user_id }).select(
            'user_img email phone_number full_name sex date_of_birth japanese_level'
        );

        if (!user) {
            return res.status(404).json({
                message: "User không tồn tại",
                success: false
            });
        }

        res.json({
            userInfo: user,
            success: true
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

// Cập nhật thông tin người dùng
export const userInfoUpdate = async (req, res) => {
    try {
        const token = req.body.jwt;

        if (!token) {
            return res.json({
                message: "Người dùng chưa đăng nhập",
                success: false
            });
        }

        if (isTokenExpired(token)) {
            return res.json({
                message: "Người dùng hết phiên đăng nhập",
                success: false
            });
        }

        const decoded = verifyToken(token);

        // Cập nhật thông tin người dùng bằng user_id trong MongoDB
        const updatedUser = await User.findOneAndUpdate(
            { user_id: decoded.id },
            {
                full_name: req.body.name,
                phone_number: req.body.phone__number,
                email: req.body.gmail
            },
            { new: true } // Trả về tài liệu đã cập nhật
        );

        if (!updatedUser) {
            return res.status(404).json({
                message: "User không tồn tại",
                success: false
            });
        }

        res.json({
            message: "Cập nhật thành công",
            success: true,
            userInfo: updatedUser
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};
