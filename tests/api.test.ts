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
});