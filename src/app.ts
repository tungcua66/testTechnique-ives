import express from "express";
import taskRoutes from "./routes/taskRoutes";
import oauthRoutes from "./routes/oauthRoutes";
import { requireAuth } from "./middleware/authMiddleware";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// OAuth server - public
app.use("/oauth", oauthRoutes);

// Tasks API - protected
app.use("/tasks", requireAuth, taskRoutes);

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

export default app;
