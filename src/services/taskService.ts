import type { Task } from "../models/task";
import { createTask } from "../models/task";

let tasks: Task[] = [];

export function getAllTasks(userId: string): Task[] {
  return tasks.filter((t) => t.userId === userId);
}

export function getTaskById(id: string, userId: string): Task | undefined {
  return tasks.find((t) => t.id === id && t.userId === userId);
}

export function createNewTask(data: {
  title: string;
  description?: string;
  userId: string;
}): Task {
  const task = createTask(data);
  tasks.push(task);
  return task;
}

export function updateTask(
  id: string,
  userId: string,
  updates: Partial<Omit<Task, "id" | "userId">>
): Task | null {
  const task = getTaskById(id, userId);
  if (!task) return null;

  if (updates.title !== undefined) task.title = updates.title;
  if (updates.description !== undefined) task.description = updates.description;

  task.updatedAt = new Date();
  return task;
}

export function deleteTask(id: string, userId: string): boolean {
  const index = tasks.findIndex((t) => t.id === id && t.userId === userId);
  if (index === -1) return false;

  tasks.splice(index, 1);
  return true;
}
