import express from "express";
import { forgotPassword, forgotPasswordChangePassword, forgotPasswordCheck } from "../controllers/forgotPassword.js";
import login from "../controllers/login.js";
import logOut from "../controllers/logOut.js";
import signUp from "../controllers/signUp.js";
import { uploadImage } from "../controllers/uploadImage.js";
import { userInfo, userInfoUpdate } from "../controllers/userInfo.js";
import { upload } from "../middlewares/uploadCloud.js";
const routerUser = express.Router()

routerUser.post("/userinfo",userInfo)
routerUser.post("/userinfo/update",userInfoUpdate)
routerUser.post("/uploadimage",upload.single("image"),uploadImage)
routerUser.post("/logout",logOut)
routerUser.post("/login",login)
routerUser.post("/signUp",signUp)
routerUser.post("/forgotpassword",forgotPassword)
routerUser.post("/forgotpassword/check",forgotPasswordCheck)
routerUser.post("/forgotpassword/changePassword",forgotPasswordChangePassword)
export default routerUser;