import "./env.js";
import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import cors from "cors";
import { PORT } from "./config.js";
import { getLanAddresses } from "./services/networkInfoService.js";
import { seed } from "./db/seed.js";
import { curriculumRouter } from "./routes/curriculum.js";
import { sessionsRouter } from "./routes/sessions.js";
import { joinRouter } from "./routes/join.js";
import { pollsRouter } from "./routes/polls.js";
import { responsesRouter } from "./routes/responses.js";
import { assessmentLibraryRouter, assessmentsRouter } from "./routes/assessments.js";
import { assessmentResponsesRouter } from "./routes/assessmentResponses.js";
import { exportRouter } from "./routes/export.js";
import { reportsRouter } from "./routes/reports.js";
import { authRouter } from "./routes/auth.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const clientDist = path.resolve(__dirname, "../../client/dist");
const isProduction = process.env.NODE_ENV === "production";

await seed();

const app = express();
app.use(express.json());
if (!isProduction) {
  // Vite dev server runs on a different origin; allow it (with credentials, for the auth
  // cookie) during development only. In production everything is same-origin.
  app.use(cors({ origin: true, credentials: true }));
}

app.get("/api/hello", (_req, res) => {
  res.json({ message: "Career counselling server is running" });
});

app.get("/api/server-info", (_req, res) => {
  res.json({ port: PORT, lanAddresses: getLanAddresses() });
});

app.use("/api/auth", authRouter);
app.use("/api/curriculum", curriculumRouter);
app.use("/api/sessions", sessionsRouter);
app.use("/api/join", joinRouter);
app.use("/api/sessions", pollsRouter);
app.use("/api/responses", responsesRouter);
app.use("/api/assessments", assessmentLibraryRouter);
app.use("/api/sessions", assessmentsRouter);
app.use("/api/assessment-responses", assessmentResponsesRouter);
app.use("/api/export", exportRouter);
app.use("/api/reports", reportsRouter);

if (isProduction) {
  app.use(express.static(clientDist));
  app.get(/^(?!\/api).*/, (_req, res) => {
    res.sendFile(path.join(clientDist, "index.html"));
  });
}

app.listen(PORT, "0.0.0.0", () => {
  const addresses = getLanAddresses();
  console.log(`Server listening on port ${PORT}`);
  console.log(`  Local:   http://localhost:${PORT}`);
  for (const addr of addresses) {
    console.log(`  Network: http://${addr}:${PORT}`);
  }
});
