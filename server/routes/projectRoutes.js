import { Router } from "express";
import { createProject, deleteProjects, getProject, getPublicProjectFiles, listProjects, publishProject, updateProjectFiles } from "../controllers/projectController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";


const projectRouter = Router();

// public Route
projectRouter.get("public/:id", getPublicProjectFiles)

// protect all following routes
projectRouter.use(authMiddleware)

projectRouter.post("/", createProject)
projectRouter.post("/", listProjects)
projectRouter.post("/", getProject)
projectRouter.post("/", deleteProjects)
projectRouter.post("/", updateProjectFiles)
projectRouter.post("/", publishProject)

export default projectRouter;