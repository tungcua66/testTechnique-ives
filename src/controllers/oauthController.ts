import type { Request, Response } from "express";
import {
  validateClientAndRedirectUri,
  createAuthorizationCode,
  exchangeAuthorizationCode,
  exchangeRefreshToken,
} from "../services/oauthService";

const getAuthenticatedUserId = (_req: Request): string => {
  return "demo-user";
};

// GET /oauth/authorize
export function authorize(req: Request, res: Response) {
  const { response_type, client_id, redirect_uri, state } = req.query as Record<
    string,
    string | undefined
  >;

  if (response_type !== "code") {
    return res.status(400).json({ error: "unsupported_response_type" });
  }
  if (!client_id || !redirect_uri) {
    return res.status(400).json({ error: "invalid_request" });
  }

  const client = validateClientAndRedirectUri(client_id, redirect_uri);
  if (!client) {
    return res.status(400).json({ error: "invalid_client_or_redirect_uri" });
  }

  const userId = getAuthenticatedUserId(req);

  const code = createAuthorizationCode(client_id, redirect_uri, userId);

  const url = new URL(redirect_uri);
  url.searchParams.set("code", code.code);
  if (state) {
    url.searchParams.set("state", state);
  }

  // In proper OAuth, we redirect the user-agent
  return res.redirect(url.toString());
}

// POST /oauth/token
export function token(req: Request, res: Response) {
  const { grant_type } = req.body as Record<string, string | undefined>;

  if (!grant_type) {
    return res.status(400).json({ error: "invalid_request" });
  }

  try {
    if (grant_type === "authorization_code") {
      const { code, redirect_uri, client_id, client_secret } =
        req.body as Record<string, string>;

      if (!code || !redirect_uri || !client_id || !client_secret) {
        return res.status(400).json({ error: "invalid_request" });
      }

      const tokenResponse = exchangeAuthorizationCode(
        code,
        client_id,
        client_secret,
        redirect_uri
      );

      return res.json({
        access_token: tokenResponse.accessToken,
        token_type: "Bearer",
        expires_in: tokenResponse.expiresIn,
        refresh_token: tokenResponse.refreshToken,
      });
    }

    if (grant_type === "refresh_token") {
      const { refresh_token, client_id, client_secret } = req.body as Record<
        string,
        string
      >;

      if (!refresh_token || !client_id || !client_secret) {
        return res.status(400).json({ error: "invalid_request" });
      }

      const tokenResponse = exchangeRefreshToken(
        refresh_token,
        client_id,
        client_secret
      );

      return res.json({
        access_token: tokenResponse.accessToken,
        token_type: "Bearer",
        expires_in: tokenResponse.expiresIn,
        refresh_token: tokenResponse.refreshToken,
      });
    }

    return res.status(400).json({ error: "unsupported_grant_type" });
  } catch (err: any) {
    const error = err?.message || "server_error";
    return res.status(400).json({ error });
  }
}
