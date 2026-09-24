import type { FastifyInstance } from "fastify";
import { z } from "zod";
import {
  AUTH_COOKIE_NAME,
  clearAuthCookie,
  createPasswordResetToken,
  createSessionForUser,
  deleteSessionById,
  getRoleDashboard,
  parseCookieHeader,
  registerUser,
  requireRole,
  requireSession,
  safeUser,
  setAuthCookie,
  updatePasswordForEmail,
  verifyPasswordResetToken,
  verifyUserCredentials,
  type Role,
} from "../auth";
import { DanmanteError } from "../errorCodes";

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(["PATIENT", "NURSE", "PHARMACIST", "PHARMACY"]).optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const resetRequestSchema = z.object({
  email: z.string().email(),
});

const resetPasswordSchema = z.object({
  token: z.string().min(10),
  password: z.string().min(8),
});

function getSessionIdFromRequest(request: Parameters<typeof requireSession>[0]) {
  const rawCookie = String((request.headers.cookie as string | undefined) ?? "");
  const cookieObject = parseCookieHeader(rawCookie);
  return cookieObject[AUTH_COOKIE_NAME] ?? null;
}

export async function authRoutes(app: FastifyInstance) {
  app.post("/api/v1/auth/register", async (request, reply) => {
    const parsed = registerSchema.safeParse(request.body);
    if (!parsed.success) {
      throw new DanmanteError("VALIDATION_ERROR", "Invalid registration payload.", 400, parsed.error.flatten());
    }

    const user = registerUser(parsed.data);
    return reply.status(201).send({ message: "Registration successful.", user });
  });

  app.post("/api/v1/auth/login", async (request, reply) => {
    const parsed = loginSchema.safeParse(request.body);
    if (!parsed.success) {
      throw new DanmanteError("VALIDATION_ERROR", "Invalid login payload.", 400, parsed.error.flatten());
    }

    const user = verifyUserCredentials(parsed.data.email, parsed.data.password);
    if (!user) {
      throw new DanmanteError("AUTH_REQUIRED", "Invalid email or password.", 401);
    }

    const session = createSessionForUser(user.id);
    setAuthCookie(reply, session.id);

    return {
      message: "Login successful.",
      user: safeUser(user),
    };
  });

  app.post("/api/v1/auth/logout", async (request, reply) => {
    const sessionId = getSessionIdFromRequest(request);
    const removed = deleteSessionById(sessionId);
    clearAuthCookie(reply);
    return {
      success: removed,
      message: removed ? "Logout successful." : "No active session found.",
    };
  });

  app.get("/api/v1/auth/me", async (request) => {
    const user = requireSession(request);
    return { user: safeUser(user) };
  });

  app.post("/api/v1/auth/forgot-password", async (request) => {
    const parsed = resetRequestSchema.safeParse(request.body);
    if (!parsed.success) {
      throw new DanmanteError("VALIDATION_ERROR", "Invalid email address.", 400, parsed.error.flatten());
    }

    const token = createPasswordResetToken(parsed.data.email);
    return {
      success: true,
      message: token ? "If an account exists for that email, a reset link has been generated." : "If an account exists for that email, a reset link has been generated.",
    };
  });

  app.post("/api/v1/auth/reset-password", async (request) => {
    const parsed = resetPasswordSchema.safeParse(request.body);
    if (!parsed.success) {
      throw new DanmanteError("VALIDATION_ERROR", "Invalid reset payload.", 400, parsed.error.flatten());
    }

    const account = verifyPasswordResetToken(parsed.data.token);
    if (!account) {
      throw new DanmanteError("VALIDATION_ERROR", "The password reset token is invalid or expired.", 400);
    }

    const updated = updatePasswordForEmail(account.email, parsed.data.password);
    return { success: true, message: "Password updated successfully.", user: updated };
  });

  app.get("/api/v1/dashboard/:role", async (request, reply) => {
    const roleParam = String((request.params as { role?: string }).role ?? "").toLowerCase();
    const dashboardRoles = ["patient", "nurse", "pharmacist", "pharmacy", "admin"] as const;
    if (!dashboardRoles.includes(roleParam as (typeof dashboardRoles)[number])) {
      throw new DanmanteError("VALIDATION_ERROR", "Unsupported dashboard role.", 400);
    }

    const requestedRole = roleParam.toUpperCase() as Role;
    const user = requireRole(request, requestedRole);

    const dashboardKey = getRoleDashboard(user.role);
    if (dashboardKey !== roleParam) {
      throw new DanmanteError("FORBIDDEN", "You do not have access to this dashboard.", 403);
    }

    return reply.status(200).send({
      dashboard: dashboardKey,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  });
}
