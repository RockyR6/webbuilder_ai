
import { Router } from "express";
import {
  createProject,
  deleteProjects,
  getProject,
  getPublicProjectFiles,
  listProjects,
  publishProject,
  updateProjectFiles,
} from "../controllers/projectController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { chat } from "../controllers/chatController.js";

const projectRouter = Router();

// Public route
projectRouter.get("/public/:id", getPublicProjectFiles);

// Protect all routes below this line
projectRouter.use(authMiddleware);

// List all projects
projectRouter.get("/", listProjects);

// Create a project
projectRouter.post("/", createProject);

// Get one project
projectRouter.get("/:id", getProject);

// Delete a project
projectRouter.delete("/:id", deleteProjects);

// Update project files
projectRouter.put("/:id/files", updateProjectFiles);

// Publish a project
projectRouter.post("/:id/publish", publishProject);

// Chat with AI
projectRouter.post("/:id/chat", chat);

export default projectRouter;
