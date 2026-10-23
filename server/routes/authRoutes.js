import { Router } from "express";
import { getUser, loginUser, logoutUser, registerUser } from "../controllers/userController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";


const authRouter = Router()

authRouter.post("/register", registerUser)
authRouter.post("/login", loginUser)
authRouter.post("/logout", logoutUser)
authRouter.get("/me", authMiddleware, getUser)

export default authRouter;