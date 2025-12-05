# Node.js OAuth2 Authorization Server + Resource Server + SSO + Client App

This project is a complete OAuth2 Authorization Server using Node.js, Express, and TypeScript.
It includes:

- OAuth2 Authorization Code Flow
- JWT Access Tokens + Refresh Tokens
- A protected Resource Server (`/tasks`)
- A mock LDAP authentication system
- Google OAuth2 SSO integration
- A minimal Client Application (`/client/login`, `/client/callback`)

This project was built for a backend technical test.

---

## 🚀 Features

### ✔ OAuth2 Authorization Server

- `/oauth/authorize`
- `/oauth/token`
- Validates `client_id`, `redirect_uri`, and authorization codes
- Issues:
  - Authorization Code
  - Access Token (JWT)
  - Refresh Token

### ✔ Resource Server (Tasks API)

- CRUD operations on `/tasks`
- Task ownership linked to authenticated user
- Protected by JWT middleware

### ✔ SSO Authentication

#### Mock LDAP Login

- `/auth/ldap`
- Validates username/password
- Returns authorization code

#### Google OAuth2 Login

- `/auth/google`
- `/auth/google/callback`
- Generates authorization code after Google login

### ✔ OAuth2 Client Application

Simulates a frontend:

- `/client/login`
- `/client/callback`
- `/client/tasks`

---

## 🧪 How to Run

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create a `.env` file in the root directory:

```bash
# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Server Configuration
PORT=3000

# JWT Secret (required for signing OAuth tokens)
JWT_SECRET=your-secret-key-here
```

### 3. Run in development mode

```bash
npm run dev
```

The server will start on `http://localhost:3000`

### 4. Build for production

```bash
npm run build
```

### 5. Start production server

```bash
npm start
```

---
