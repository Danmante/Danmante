import { afterEach, describe, expect, it } from "vitest";
import type { FastifyInstance } from "fastify";
import { createApp } from "../app";

const config = {
  env: "test" as const,
  port: 0,
  corsAllowedOrigins: ["http://localhost:3000"],
  rateLimit: { windowMs: 60_000, max: 100 },
};

describe("API safety boundaries", () => {
  let app: FastifyInstance | undefined;

  afterEach(async () => {
    await app?.close();
    app = undefined;
  });

  it("returns a safe denial for an unknown jurisdiction", async () => {
    app = await createApp(config);
    const response = await app.inject({
      method: "GET",
      url: "/api/v1/jurisdictions/check?country=ZZ&consultationType=video",
    });

    expect(response.statusCode).toBe(200);
    expect(response.json().decision).toMatchObject({
      allowed: false,
      reasonCode: "JURISDICTION_NOT_SUPPORTED",
    });
  });

  it("does not authorize the provisional active registry entry", async () => {
    app = await createApp(config);
    const response = await app.inject({
      method: "GET",
      url: "/api/v1/jurisdictions/check?country=US&region=US-CA&consultationType=video",
    });

    expect(response.statusCode).toBe(200);
    expect(response.json().decision.allowed).toBe(false);
  });

  it("rejects malformed jurisdiction queries", async () => {
    app = await createApp(config);
    const response = await app.inject({
      method: "GET",
      url: "/api/v1/jurisdictions/check?country=USA&consultationType=video",
    });

    expect(response.statusCode).toBe(400);
    expect(response.json().error.code).toBe("VALIDATION_ERROR");
  });

  it("reports readiness honestly while persistence is not wired", async () => {
    app = await createApp(config);
    const response = await app.inject({ method: "GET", url: "/health/ready" });

    expect(response.statusCode).toBe(503);
    expect(response.json()).toMatchObject({
      status: "not_ready",
      checks: { database: "not_configured", redis: "not_configured" },
    });
  });

  it("allows a user to register, log in, access their dashboard, and then logout", async () => {
    app = await createApp(config);

    const registerResponse = await app.inject({
      method: "POST",
      url: "/api/v1/auth/register",
      payload: {
        name: "Jane Patient",
        email: "jane.patient@example.com",
        password: "Password123!",
        role: "PATIENT",
      },
    });

    expect(registerResponse.statusCode).toBe(201);
    expect(registerResponse.json().user.email).toBe("jane.patient@example.com");

    const loginResponse = await app.inject({
      method: "POST",
      url: "/api/v1/auth/login",
      payload: {
        email: "jane.patient@example.com",
        password: "Password123!",
      },
    });

    expect(loginResponse.statusCode).toBe(200);
    const cookie = String(loginResponse.headers["set-cookie"]?.[0] ?? "").split(";")[0];
    expect(cookie).toContain("danmante_session=");

    const meResponse = await app.inject({
      method: "GET",
      url: "/api/v1/auth/me",
      headers: { cookie },
    });

    expect(meResponse.statusCode).toBe(200);
    expect(meResponse.json().user.role).toBe("PATIENT");

    const patientDashboard = await app.inject({
      method: "GET",
      url: "/api/v1/dashboard/patient",
      headers: { cookie },
    });

    expect(patientDashboard.statusCode).toBe(200);
    expect(patientDashboard.json().dashboard).toBe("patient");

    const nurseDashboard = await app.inject({
      method: "GET",
      url: "/api/v1/dashboard/nurse",
      headers: { cookie },
    });

    expect(nurseDashboard.statusCode).toBe(403);

    const logoutResponse = await app.inject({
      method: "POST",
      url: "/api/v1/auth/logout",
      headers: { cookie },
    });

    expect(logoutResponse.statusCode).toBe(200);

    const meAfterLogout = await app.inject({
      method: "GET",
      url: "/api/v1/auth/me",
      headers: { cookie },
    });

    expect(meAfterLogout.statusCode).toBe(401);
  });

  it("rejects invalid login credentials", async () => {
    app = await createApp(config);

    await app.inject({
      method: "POST",
      url: "/api/v1/auth/register",
      payload: {
        name: "Dr. Access",
        email: "doc@example.com",
        password: "Password123!",
        role: "NURSE",
      },
    });

    const response = await app.inject({
      method: "POST",
      url: "/api/v1/auth/login",
      payload: {
        email: "doc@example.com",
        password: "WrongPassword!",
      },
    });

    expect(response.statusCode).toBe(401);
    expect(response.json().error.code).toBe("AUTH_REQUIRED");
  });

  it("does not allow public registration to create an admin account", async () => {
    app = await createApp(config);

    const response = await app.inject({
      method: "POST",
      url: "/api/v1/auth/register",
      payload: {
        name: "Untrusted Admin",
        email: "untrusted.admin@example.com",
        password: "Password123!",
        role: "ADMIN",
      },
    });

    expect(response.statusCode).toBe(400);
    expect(response.json().error.code).toBe("VALIDATION_ERROR");
  });
});