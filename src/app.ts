import express from "express";
import taskRoutes from "./routes/taskRoutes";
import oauthRoutes from "./routes/oauthRoutes";
import clientRoutes from "./routes/clientRoutes";
import { requireAuth } from "./middleware/authMiddleware";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// OAuth endpoints
app.use("/oauth", oauthRoutes);

// Client application
app.use("/client", clientRoutes);

// Protected resource server
app.use("/tasks", requireAuth, taskRoutes);

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

export default app;
