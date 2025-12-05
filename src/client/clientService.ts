import axios from "axios";

let accessToken: string | null = null;
let refreshToken: string | null = null;

export function getTokens() {
  return { accessToken, refreshToken };
}

export async function exchangeCodeForTokens(code: string) {
  const tokenUrl = "http://localhost:3000/oauth/token";

  const params = new URLSearchParams();
  params.append("grant_type", "authorization_code");
  params.append("code", code);
  params.append("redirect_uri", "http://localhost:3000/client/callback");
  params.append("client_id", "task-client");
  params.append("client_secret", "task-secret");

  const response = await axios.post(tokenUrl, params);

  accessToken = response.data.access_token;
  refreshToken = response.data.refresh_token;

  return response.data;
}

export async function fetchTasksFromAPI() {
  if (!accessToken) {
    throw new Error("Not authenticated");
  }

  const response = await axios.get("http://localhost:3000/tasks", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return response.data;
}
