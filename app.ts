import Fastify, { type FastifyInstance } from "fastify";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import rateLimit from "@fastify/rate-limit";
import { loadConfig } from "./config";
import { healthRoutes } from "./routes/health";
import { authRoutes } from "./routes/auth";
import { jurisdictionRoutes } from "./routes/jurisdictions";
import { DanmanteError } from "./errorCodes";
import { closeDatabase } from "./db";

export async function createApp(config = loadConfig()): Promise<FastifyInstance> {
  const app = Fastify({ logger: false, trustProxy: false });

  await app.register(helmet);
  await app.register(cors, { origin: config.corsAllowedOrigins, credentials: true });
  await app.register(rateLimit, {
    max: config.rateLimit.max,
    timeWindow: config.rateLimit.windowMs,
  });

  app.setErrorHandler((error, _request, reply) => {
    if (error instanceof DanmanteError) {
      return reply.status(error.httpStatus).send(error.toJSON());
    }
    app.log.error(error);
    return reply.status(500).send({ error: { code: "INTERNAL_ERROR", message: "Something went wrong." } });
  });

  await app.register(healthRoutes);
  await app.register(authRoutes);
  await app.register(jurisdictionRoutes);
  app.addHook("onClose", async () => {
    await closeDatabase();
  });
  return app;
}
