export interface OAuthClient {
  clientId: string;
  clientSecret: string;
  redirectUris: string[];
  name: string;
}

export const JWT_SECRET = process.env.JWT_SECRET || "super-secret-change-me"; // use something from .env in real project

export const ACCESS_TOKEN_TTL_SECONDS = 15 * 60; // 15 min
export const REFRESH_TOKEN_TTL_SECONDS = 7 * 24 * 60 * 60; // 7 days

export const oauthClients: OAuthClient[] = [
  {
    clientId: "task-client",
    clientSecret: "task-secret",
    redirectUris: ["http://localhost:4000/callback"],
    name: "Task Client App",
  },
];
