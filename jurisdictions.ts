import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { canBookConsultation, getEmergencyGuidance } from "./engine";
import { DanmanteError } from "./errorCodes";

const querySchema = z.object({
  country: z.string().length(2),
  region: z.string().optional(),
  consultationType: z.enum(["video", "audio", "message"]).default("video"),
});

export async function jurisdictionRoutes(app: FastifyInstance) {
  app.get("/api/v1/jurisdictions/check", async (req, reply) => {
    const parsed = querySchema.safeParse(req.query);
    if (!parsed.success) {
      const err = new DanmanteError(
        "VALIDATION_ERROR",
        "Invalid jurisdiction query parameters.",
        400,
        parsed.error.flatten()
      );
      return reply.status(err.httpStatus).send(err.toJSON());
    }
    const { country, region, consultationType } = parsed.data;
    const key = { country, region };
    const decision = canBookConsultation(key, consultationType);
    const emergency = getEmergencyGuidance(key);
    return reply.send({ decision, emergency });
  });
}
