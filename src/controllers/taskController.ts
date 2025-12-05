import type { Request, Response } from "express";
import {
  getAllTasks,
  getTaskById,
  createNewTask,
  updateTask,
  deleteTask,
} from "../services/taskService";

const getUserId = (req: Request): string => {
  return (req as any).userId;
};

export function getTasks(req: Request, res: Response) {
  const userId = getUserId(req);
  const tasks = getAllTasks(userId);
  res.json(tasks);
}

export function getTask(req: Request, res: Response) {
  const userId = getUserId(req);
  if (!req.params.id)
    return res.status(400).json({ error: "Task id required" });

  const task = getTaskById(req.params.id, userId);
  if (!task) return res.status(404).json({ error: "Task not found" });

  res.json(task);
}

export function createTask(req: Request, res: Response) {
  const userId = getUserId(req);
  const { title, description } = req.body;

  const task = createNewTask({ title, description, userId });
  res.status(201).json(task);
}

export function updateTaskController(req: Request, res: Response) {
  const userId = getUserId(req);
  if (!req.params.id)
    return res.status(400).json({ error: "Task id required" });

  const updated = updateTask(req.params.id, userId, req.body);

  if (!updated) return res.status(404).json({ error: "Task not found" });
  res.json(updated);
}

export function deleteTaskController(req: Request, res: Response) {
  const userId = getUserId(req);
  if (!req.params.id)
    return res.status(400).json({ error: "Task id required" });

  const deleted = deleteTask(req.params.id, userId);

  if (!deleted) return res.status(404).json({ error: "Task not found" });
  res.status(204).send();
}
