import { Router } from "express";
import { AUTH_COOKIE_NAME, createSessionToken, verifyCredentials } from "../services/authService.js";
import { requireAuth } from "../middleware/requireAuth.js";

export const authRouter = Router();
const isProduction = process.env.NODE_ENV === "production";
const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

authRouter.post("/login", (req, res) => {
  const { username, password } = req.body as { username?: string; password?: string };
  if (!username || !password || !verifyCredentials(username, password)) {
    res.status(401).json({ error: "Invalid username or password" });
    return;
  }

  const token = createSessionToken(username);
  res.cookie(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: isProduction,
    maxAge: THIRTY_DAYS_MS,
  });
  res.json({ ok: true, username });
});

authRouter.post("/logout", (_req, res) => {
  res.clearCookie(AUTH_COOKIE_NAME);
  res.json({ ok: true });
});

authRouter.get("/me", requireAuth, (req, res) => {
  res.json({ username: req.authUsername });
});
