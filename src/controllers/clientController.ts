import type { Request, Response } from "express";
import {
  exchangeCodeForTokens,
  fetchTasksFromAPI,
  getTokens,
} from "../client/clientService";

// GET /client/login
export function login(req: Request, res: Response) {
  const authorizeUrl = new URL("http://localhost:3000/oauth/authorize");

  authorizeUrl.searchParams.set("response_type", "code");
  authorizeUrl.searchParams.set("client_id", "task-client");
  authorizeUrl.searchParams.set(
    "redirect_uri",
    "http://localhost:3000/client/callback"
  );
  authorizeUrl.searchParams.set("state", "xyz123");

  res.redirect(authorizeUrl.toString());
}

// GET /client/callback?code=...&state=...
export async function callback(req: Request, res: Response) {
  const { code } = req.query;

  if (!code || typeof code !== "string") {
    return res.status(400).json({ error: "missing_code" });
  }

  try {
    const tokens = await exchangeCodeForTokens(code);
    res.json({
      message: "Authorization successful!",
      tokens,
    });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}

// GET /client/tasks
export async function clientTasks(req: Request, res: Response) {
  try {
    const tasks = await fetchTasksFromAPI();
    res.json({
      tokens: getTokens(),
      tasks,
    });
  } catch (err: any) {
    res.status(401).json({ error: err.message });
  }
}
