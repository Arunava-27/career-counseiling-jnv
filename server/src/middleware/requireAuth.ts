import type { Request, Response, NextFunction } from "express";
import { AUTH_COOKIE_NAME, parseCookies, verifySessionToken } from "../services/authService.js";

declare global {
  namespace Express {
    interface Request {
      authUsername?: string;
    }
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const cookies = parseCookies(req.headers.cookie);
  const username = verifySessionToken(cookies[AUTH_COOKIE_NAME]);
  if (!username) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }
  req.authUsername = username;
  next();
}
