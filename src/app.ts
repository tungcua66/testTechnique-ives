import express from "express";
import taskRoutes from "./routes/taskRoutes";
import oauthRoutes from "./routes/oauthRoutes";
import clientRoutes from "./routes/clientRoutes";
import { requireAuth } from "./middleware/authMiddleware";
import googleRoutes from "./sso/googleRoutes";
import passport from "passport";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// OAuth endpoints
app.use("/oauth", oauthRoutes);

// Client application
app.use("/client", clientRoutes);

// Protected resource server
app.use("/tasks", requireAuth, taskRoutes);

// Google stategy and passport
app.use(passport.initialize());
app.use("/auth", googleRoutes);

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

export default app;
