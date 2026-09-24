import type { FastifyInstance } from "fastify";
import { checkDatabase } from "./db";

export async function healthRoutes(app: FastifyInstance) {
  app.get("/health/live", async () => ({ status: "ok" }));
  app.get("/health/ready", async (_request, reply) => {
    const redisConfigured = Boolean(process.env.REDIS_URL);
    const redis: string = redisConfigured ? "configured_but_not_wired" : "not_configured";
    const checks = {
      database: await checkDatabase(),
      redis,
    } as const;
    const ready = checks.database === "ok" && (!redisConfigured || checks.redis === "ok");

    return reply.status(ready ? 200 : 503).send({
      status: ready ? "ok" : "not_ready",
      checks,
    });
  });
}
