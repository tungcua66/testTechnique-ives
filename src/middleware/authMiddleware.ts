import type { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../services/oauthService";

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "missing_authorization_header" });
  }

  const [type, token] = authHeader.split(" ");

  if (type !== "Bearer" || !token) {
    return res.status(401).json({ error: "invalid_auth_header_format" });
  }

  try {
    const { userId } = verifyAccessToken(token);
    (req as any).userId = userId;

    next();
  } catch (err) {
    return res.status(401).json({ error: "invalid_or_expired_token" });
  }
}
