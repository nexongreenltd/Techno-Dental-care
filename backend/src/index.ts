import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

import authRouter from "./routes/auth.js";
import chambersRouter from "./routes/chambers.js";
import appointmentsRouter from "./routes/appointments.js";
import prescriptionsRouter from "./routes/prescriptions.js";
import usersRouter from "./routes/users.js";

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());

app.get("/health", (_req, res) => res.json({ status: "ok", service: "Techno Dental API" }));

app.use("/api/auth", authRouter);
app.use("/api/chambers", chambersRouter);
app.use("/api/appointments", appointmentsRouter);
app.use("/api/prescriptions", prescriptionsRouter);
app.use("/api/users", usersRouter);

app.use((_req, res) => res.status(404).json({ error: "Not found" }));

app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

const PORT = Number(process.env.PORT) || 4000;
app.listen(PORT, () => {
  console.log(`\n🦷 Techno Dental API running at http://localhost:${PORT}`);
  console.log(`   Health check: http://localhost:${PORT}/health\n`);
});
