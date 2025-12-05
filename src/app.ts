import express from "express";
import taskRoutes from "./routes/taskRoutes";
import oauthRoutes from "./routes/oauthRoutes";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/tasks", taskRoutes);
app.use("/oauth", oauthRoutes);

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

export default app;
