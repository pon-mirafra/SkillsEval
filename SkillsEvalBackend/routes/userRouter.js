import { Router } from "express";
import {registerUser,logoutUser} from "../controller/userController.js";
// import { upload } from "../middlewares/multer.middleware.js";
import { verifyJwt } from "../middleware/auth-middleware.js";
const router = Router()


router.route("/register").post(registerUser)


//secure routes
router.route("/logout").post(verifyJwt,logoutUser)

export default router

