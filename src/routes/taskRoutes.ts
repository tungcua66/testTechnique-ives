import { Router } from "express";
import {
  getTasks,
  getTask,
  createTask,
  updateTaskController,
  deleteTaskController,
} from "../controllers/taskController";

const router = Router();

router.get("/", getTasks);
router.get("/:id", getTask);
router.post("/", createTask);
router.put("/:id", updateTaskController);
router.delete("/:id", deleteTaskController);

export default router;
