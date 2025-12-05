import { Router } from "express";
import { login, callback, clientTasks } from "../controllers/clientController";

const router = Router();

router.get("/login", login);
router.get("/callback", callback);
router.get("/tasks", clientTasks);

export default router;
