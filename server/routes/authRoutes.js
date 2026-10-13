import { Router } from "express";
import { getUser, loginUser, registerUser } from "../userController";
import { authMiddleware } from "../middlewares/authMiddleware";


const authRouter = Router()

authRouter.post("/register", registerUser)
authRouter.post("/login", loginUser)
authRouter.post("/logout", registerUser)
authRouter.get("/getUser", authMiddleware, getUser)

export default authRouter;