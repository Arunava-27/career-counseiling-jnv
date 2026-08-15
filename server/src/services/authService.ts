import { createHmac, timingSafeEqual } from "node:crypto";

interface Credential {
  username: string;
  password: string;
}

// AUTH_USERS format: "name1:password1,name2:password2" — plaintext env var is an
// acceptable tradeoff here: the threat model is keeping random internet visitors and
// students out, not defending against compromise of the hosting account itself.
function loadCredentials(): Credential[] {
  const raw = process.env.AUTH_USERS ?? "";
  return raw
    .split(",")
    .map((pair) => {
      const [username, password] = pair.split(":").map((s) => s?.trim());
      return { username, password };
    })
    .filter((c): c is Credential => Boolean(c.username && c.password));
}

const SECRET = process.env.AUTH_SECRET || "dev-only-insecure-secret-change-in-production";
const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

function sign(value: string): string {
  return createHmac("sha256", SECRET).update(value).digest("hex");
}

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

export function verifyCredentials(username: string, password: string): boolean {
  const match = loadCredentials().find((c) => c.username === username);
  if (!match) return false;
  return safeEqual(match.password, password);
}

export function createSessionToken(username: string): string {
  const expiry = Date.now() + THIRTY_DAYS_MS;
  const payload = `${username}.${expiry}`;
  return `${payload}.${sign(payload)}`;
}

export function verifySessionToken(token: string | undefined): string | null {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [username, expiryStr, signature] = parts;
  const expiry = Number(expiryStr);
  if (Number.isNaN(expiry) || Date.now() > expiry) return null;
  if (!safeEqual(sign(`${username}.${expiryStr}`), signature)) return null;
  return username;
}

export function parseCookies(header: string | undefined): Record<string, string> {
  const cookies: Record<string, string> = {};
  if (!header) return cookies;
  for (const part of header.split(";")) {
    const eq = part.indexOf("=");
    if (eq === -1) continue;
    const key = part.slice(0, eq).trim();
    const value = part.slice(eq + 1).trim();
    if (key) cookies[key] = decodeURIComponent(value);
  }
  return cookies;
}

export const AUTH_COOKIE_NAME = "cc_auth";
