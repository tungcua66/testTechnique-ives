// src/services/oauthService.ts
import jwt from "jsonwebtoken";
import crypto from "crypto";
import {
  oauthClients,
  JWT_SECRET,
  ACCESS_TOKEN_TTL_SECONDS,
  REFRESH_TOKEN_TTL_SECONDS,
} from "../config/oauthConfig";
import type { OAuthClient } from "../config/oauthConfig";

export interface AuthorizationCode {
  code: string;
  clientId: string;
  redirectUri: string;
  userId: string;
  expiresAt: Date;
}

export interface RefreshTokenRecord {
  token: string;
  clientId: string;
  userId: string;
  expiresAt: Date;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

let authorizationCodes: AuthorizationCode[] = [];
let refreshTokens: RefreshTokenRecord[] = [];

export function findClient(clientId: string): OAuthClient | undefined {
  return oauthClients.find((c) => c.clientId === clientId);
}

export function validateClientAndRedirectUri(
  clientId: string,
  redirectUri: string
): OAuthClient | null {
  const client = findClient(clientId);
  if (!client) return null;
  if (!client.redirectUris.includes(redirectUri)) return null;
  return client;
}

function generateRandomString(length = 32): string {
  return crypto.randomBytes(length).toString("hex");
}

export function createAuthorizationCode(
  clientId: string,
  redirectUri: string,
  userId: string,
  ttlSeconds = 300 // 5 minutes
): AuthorizationCode {
  const code: AuthorizationCode = {
    code: generateRandomString(16),
    clientId,
    redirectUri,
    userId,
    expiresAt: new Date(Date.now() + ttlSeconds * 1000),
  };

  authorizationCodes.push(code);
  return code;
}

function generateTokens(clientId: string, userId: string): TokenResponse {
  const payload = {
    sub: userId,
    clientId,
  };

  const accessToken = jwt.sign(payload, JWT_SECRET, {
    expiresIn: ACCESS_TOKEN_TTL_SECONDS,
  });

  const refreshTokenValue = generateRandomString(32);
  const refreshToken: RefreshTokenRecord = {
    token: refreshTokenValue,
    clientId,
    userId,
    expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL_SECONDS * 1000),
  };
  refreshTokens.push(refreshToken);

  return {
    accessToken,
    refreshToken: refreshTokenValue,
    expiresIn: ACCESS_TOKEN_TTL_SECONDS,
  };
}

export function exchangeAuthorizationCode(
  codeValue: string,
  clientId: string,
  clientSecret: string,
  redirectUri: string
): TokenResponse {
  const client = findClient(clientId);
  if (!client || client.clientSecret !== clientSecret) {
    throw new Error("invalid_client");
  }

  const codeIndex = authorizationCodes.findIndex(
    (c) =>
      c.code === codeValue &&
      c.clientId === clientId &&
      c.redirectUri === redirectUri
  );

  if (codeIndex === -1) {
    throw new Error("invalid_grant");
  }

  const code = authorizationCodes[codeIndex];

  if (!code || code.expiresAt.getTime() < Date.now()) {
    authorizationCodes.splice(codeIndex, 1);
    throw new Error("expired_code");
  }

  // Consume the code (single use)
  authorizationCodes.splice(codeIndex, 1);

  return generateTokens(clientId, code.userId);
}

export function exchangeRefreshToken(
  refreshTokenValue: string,
  clientId: string,
  clientSecret: string
): TokenResponse {
  const client = findClient(clientId);
  if (!client || client.clientSecret !== clientSecret) {
    throw new Error("invalid_client");
  }

  const recordIndex = refreshTokens.findIndex(
    (r) => r.token === refreshTokenValue && r.clientId === clientId
  );

  if (recordIndex === -1) {
    throw new Error("invalid_grant");
  }

  const record = refreshTokens[recordIndex];
  if (!record || record.expiresAt.getTime() < Date.now()) {
    refreshTokens.splice(recordIndex, 1);
    throw new Error("expired_refresh_token");
  }

  // Optional: rotate refresh tokens -> remove old, issue new one
  refreshTokens.splice(recordIndex, 1);

  return generateTokens(clientId, record.userId);
}

// Helper to verify access tokens in resource server later
export function verifyAccessToken(token: string): { userId: string } {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;
    const userId = decoded.sub as string;
    if (!userId) {
      throw new Error("invalid_token");
    }
    return { userId };
  } catch {
    throw new Error("invalid_token");
  }
}
