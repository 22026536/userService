import { isTokenExpired, verifyToken } from "../middlewares/JWT.js";
import { handleUpload } from "../middlewares/uploadCloud.js";
import User from "../models/User.js";

export const uploadImage = async (req, res) => {
    try {
        const b64 = Buffer.from(req.file.buffer).toString("base64");
        let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
        const cldRes = await handleUpload(dataURI);

        const token = req.body.jwt;
        if(!token) {
            res.json({
                message: "Người dùng chưa đăng nhập",
                success: false
            });
        }
        if(isTokenExpired(token)){
            res.json({
                message: "Người dùng hết phiên đăng nhập",
                success: false
            });
        }

        const decode = verifyToken(token);
        await User.findOneAndUpdate({user_id: decode.id}, { user_img: cldRes.url });
        res.json({
            message: cldRes,
            success: true
        });
    } catch (error) {
        console.log(error);
        res.json({
            message: error.message,
            success: false
        });
    }
}