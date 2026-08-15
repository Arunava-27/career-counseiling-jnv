import { existsSync } from "node:fs";

// Loads server/.env if present — must be the first import in index.ts so env vars are
// available before other modules (db connection, auth) read them at module-load time.
if (existsSync(".env")) {
  process.loadEnvFile(".env");
}
