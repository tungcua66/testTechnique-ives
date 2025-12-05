import { v4 as uuidv4 } from "uuid";

export interface Task {
  id: string;
  title: string;
  description: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export function createTask(params: {
  title: string;
  description?: string;
  userId: string;
}): Task {
  return {
    id: uuidv4(),
    title: params.title,
    description: params.description ?? "",
    userId: params.userId,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}
