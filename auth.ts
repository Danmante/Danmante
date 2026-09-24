import crypto from "node:crypto";
import type { FastifyRequest, FastifyReply } from "fastify";
import { DanmanteError } from "./errorCodes";

export const AUTH_COOKIE_NAME = "danmante_session";
export const VALID_ROLES = ["PATIENT", "NURSE", "PHARMACIST", "PHARMACY", "ADMIN"] as const;
export type Role = (typeof VALID_ROLES)[number];

export interface UserRecord {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  passwordSalt: string;
  role: Role;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
  resetToken?: string | null;
  resetTokenExpiresAt?: string | null;
}

export interface SessionRecord {
  id: string;
  userId: string;
  createdAt: string;
  expiresAt: string;
}

const users = new Map<string, UserRecord>();
const sessions = new Map<string, SessionRecord>();

const PASSWORD_POLICY = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

function isRole(value: unknown): value is Role {
  return typeof value === "string" && VALID_ROLES.includes(value as Role);
}

export function safeUser(user: UserRecord) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    emailVerified: user.emailVerified,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

export function getUsersForDebug() {
  return [...users.values()].map((user) => safeUser(user));
}

export function normalizeRole(input: string | undefined): Role {
  const role = (input ?? "PATIENT").trim().toUpperCase();
  if (!isRole(role)) {
    throw new DanmanteError("VALIDATION_ERROR", "Unsupported role selected.", 400);
  }
  return role;
}

export function validatePassword(password: string) {
  if (!PASSWORD_POLICY.test(password)) {
    throw new DanmanteError(
      "VALIDATION_ERROR",
      "Password must be at least 8 characters and include uppercase, lowercase, a number, and a symbol.",
      400,
    );
  }
}

export function hashPassword(password: string, salt = crypto.randomBytes(16).toString("hex")) {
  const hash = crypto.pbkdf2Sync(password, salt, 120000, 64, "sha512").toString("hex");
  return { salt, hash };
}

export function registerUser(input: { name: string; email: string; password: string; role?: string }) {
  const name = String(input.name ?? "").trim();
  const email = String(input.email ?? "").trim().toLowerCase();
  if (!name || !email) {
    throw new DanmanteError("VALIDATION_ERROR", "Name and email are required.", 400);
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new DanmanteError("VALIDATION_ERROR", "A valid email address is required.", 400);
  }
  validatePassword(String(input.password ?? ""));

  if (users.has(email)) {
    throw new DanmanteError("VALIDATION_ERROR", "An account with that email already exists.", 409);
  }

  const role = normalizeRole(input.role);
  const now = new Date().toISOString();
  const { salt, hash } = hashPassword(String(input.password));

  const user: UserRecord = {
    id: crypto.randomUUID(),
    name,
    email,
    passwordHash: hash,
    passwordSalt: salt,
    role,
    emailVerified: false,
    createdAt: now,
    updatedAt: now,
    resetToken: null,
    resetTokenExpiresAt: null,
  };

  users.set(email, user);
  return safeUser(user);
}

export function verifyUserCredentials(email: string, password: string) {
  const lookup = users.get(String(email).trim().toLowerCase());
  if (!lookup) {
    return null;
  }
  const { hash } = hashPassword(password, lookup.passwordSalt);
  if (hash !== lookup.passwordHash) {
    return null;
  }
  return lookup;
}

export function createSessionForUser(userId: string) {
  const sessionId = crypto.randomUUID();
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 1000 * 60 * 60 * 8);

  const session: SessionRecord = {
    id: sessionId,
    userId,
    createdAt: now.toISOString(),
    expiresAt: expiresAt.toISOString(),
  };

  sessions.set(sessionId, session);
  return session;
}

export function deleteSessionById(sessionId: string | null | undefined) {
  if (!sessionId) return false;
  const existed = sessions.has(sessionId);
  if (existed) sessions.delete(sessionId);
  return existed;
}

export function parseCookieHeader(cookieHeader: string | undefined) {
  const result: Record<string, string> = {};
  if (!cookieHeader) return result;

  for (const part of cookieHeader.split(";")) {
    const clean = part.trim();
    if (!clean) continue;
    const index = clean.indexOf("=");
    const key = index >= 0 ? clean.slice(0, index) : clean;
    const value = index >= 0 ? clean.slice(index + 1) : "";
    result[key] = decodeURIComponent(value);
  }

  return result;
}

export function requireSession(request: FastifyRequest): UserRecord {
  const cookieHeader = String((request.headers.cookie as string | undefined) ?? "");
  const cookie = parseCookieHeader(cookieHeader);
  const sessionId = cookie[AUTH_COOKIE_NAME];
  if (!sessionId) {
    throw new DanmanteError("AUTH_REQUIRED", "Authentication is required.", 401);
  }

  const session = sessions.get(sessionId);
  if (!session) {
    throw new DanmanteError("AUTH_REQUIRED", "Your session is invalid or expired.", 401);
  }

  if (new Date(session.expiresAt).getTime() <= Date.now()) {
    sessions.delete(sessionId);
    throw new DanmanteError("AUTH_REQUIRED", "Your session has expired. Please sign in again.", 401);
  }

  const user = [...users.values()].find((entry) => entry.id === session.userId);
  if (!user) {
    sessions.delete(sessionId);
    throw new DanmanteError("AUTH_REQUIRED", "User session could not be resolved.", 401);
  }

  return user;
}

export function requireRole(request: FastifyRequest, expectedRole: Role | Role[]) {
  const user = requireSession(request);
  const allowed = Array.isArray(expectedRole) ? expectedRole : [expectedRole];
  if (user.role === "ADMIN" || allowed.includes(user.role)) {
    return user;
  }
  throw new DanmanteError("FORBIDDEN", "You do not have access to this resource.", 403);
}

export function setAuthCookie(reply: FastifyReply, sessionId: string) {
  const cookieValue = encodeURIComponent(sessionId);
  const expires = new Date(Date.now() + 1000 * 60 * 60 * 8).toUTCString();
  const cookie = `${AUTH_COOKIE_NAME}=${cookieValue}; Path=/; HttpOnly; SameSite=Lax; Expires=${expires}; ${process.env.NODE_ENV === "production" ? "Secure; " : ""}`.trim();
  const existing = reply.getHeader("set-cookie");
  const values = Array.isArray(existing) ? existing : existing ? [String(existing)] : [];
  reply.header("set-cookie", [...values, cookie]);
}

export function clearAuthCookie(reply: FastifyReply) {
  const expired = `${AUTH_COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Expires=Thu, 01 Jan 1970 00:00:00 GMT; ${process.env.NODE_ENV === "production" ? "Secure; " : ""}`.trim();
  const existing = reply.getHeader("set-cookie");
  const values = Array.isArray(existing) ? existing : existing ? [String(existing)] : [];
  reply.header("set-cookie", [...values, expired]);
}

export function updatePasswordForEmail(email: string, password: string) {
  const current = users.get(email.trim().toLowerCase());
  if (!current) {
    throw new DanmanteError("VALIDATION_ERROR", "No account matches that email address.", 404);
  }
  validatePassword(password);
  const { salt, hash } = hashPassword(password);
  current.passwordHash = hash;
  current.passwordSalt = salt;
  current.updatedAt = new Date().toISOString();
  current.resetToken = null;
  current.resetTokenExpiresAt = null;
  users.set(email.trim().toLowerCase(), current);
  return safeUser(current);
}

export function createPasswordResetToken(email: string) {
  const user = users.get(email.trim().toLowerCase());
  if (!user) {
    return null;
  }
  const token = crypto.randomBytes(24).toString("hex");
  user.resetToken = token;
  user.resetTokenExpiresAt = new Date(Date.now() + 1000 * 60 * 30).toISOString();
  return token;
}

export function verifyPasswordResetToken(token: string) {
  for (const user of users.values()) {
    if (user.resetToken === token && user.resetTokenExpiresAt) {
      if (new Date(user.resetTokenExpiresAt).getTime() > Date.now()) {
        return user;
      }
    }
  }
  return null;
}

export function getRoleDashboard(role: Role) {
  if (role === "PATIENT") return "patient";
  if (role === "NURSE") return "nurse";
  if (role === "PHARMACIST") return "pharmacist";
  if (role === "PHARMACY") return "pharmacy";
  return "admin";
}
