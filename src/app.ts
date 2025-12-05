import express from "express";
import taskRoutes from "./routes/taskRoutes.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/tasks", taskRoutes);

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

export default app;
