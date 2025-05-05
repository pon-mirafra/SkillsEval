import { Router } from "express";
import { registerUser, logoutUser, loginUser } from "../controller/userController.js";
// import { upload } from "../middlewares/multer.middleware.js";
import { verifyJwt } from "../middleware/auth-middleware.js";
const router = Router()


router.route("/register").post(registerUser)
router.route("/login").post(loginUser)

//secure routes
router.route("/logout").post(verifyJwt, logoutUser)

export default router

