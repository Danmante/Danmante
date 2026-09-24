import type { FastifyInstance } from "fastify";

export async function healthRoutes(app: FastifyInstance) {
  app.get("/health/live", async () => ({ status: "ok" }));
  app.get("/health/ready", async (_request, reply) => {
    const checks = {
      database: process.env.DATABASE_URL ? "configured_but_not_wired" : "not_configured",
      redis: process.env.REDIS_URL ? "configured_but_not_wired" : "not_configured",
    } as const;
    const ready = Object.values(checks).every((status) => (status as string) === "ok");

    return reply.status(ready ? 200 : 503).send({
      status: ready ? "ok" : "not_ready",
      checks,
    });
  });
}
