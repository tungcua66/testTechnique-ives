import type { Request, Response } from "express";
import { ldapUsers } from "./ldapUsers";
import { createAuthorizationCode } from "../services/oauthService";

export function ldapLogin(req: Request, res: Response) {
  const { username, password, client_id, redirect_uri } = req.body;

  // Validate input
  if (!username || !password || !client_id || !redirect_uri) {
    return res.status(400).json({ error: "missing_credentials" });
  }

  // Mock LDAP lookup
  const user = ldapUsers.find(
    (u) => u.username === username && u.password === password
  );

  if (!user) {
    return res.status(401).json({ error: "invalid_credentials" });
  }

  // Attach authenticated SSO user to request
  (req as any).user = { userId: user.userId };

  // Issue OAuth2 authorization code for this user
  const code = createAuthorizationCode(client_id, redirect_uri, user.userId);

  return res.json({
    message: "LDAP login successful",
    userId: user.userId,
    code: code.code,
    redirect_to: `${redirect_uri}?code=${code.code}`,
  });
}
