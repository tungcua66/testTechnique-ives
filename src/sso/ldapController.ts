import type { Request, Response } from "express";
import { ldapUsers } from "./ldapUsers.js";
import { createAuthorizationCode } from "../services/oauthService";

export function ldapLogin(req: Request, res: Response) {
  const { username, password, client_id, redirect_uri } = req.body;

  if (!username || !password || !client_id || !redirect_uri) {
    return res.status(400).json({ error: "missing_credentials" });
  }

  const user = ldapUsers.find(
    (u) => u.username === username && u.password === password
  );

  if (!user) {
    return res.status(401).json({ error: "invalid_credentials" });
  }

  // LDAP authentication succeeded, now issue OAuth2 authorization code
  const code = createAuthorizationCode(client_id, redirect_uri, user.userId);

  return res.json({
    message: "LDAP login successful",
    code: code.code,
    redirect_to: `${redirect_uri}?code=${code.code}`,
  });
}
