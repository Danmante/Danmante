/**
 * Security-critical configuration loader. Throws (fails startup) if a
 * required security variable is missing — see requirement #30/#52:
 * "Security-critical missing configuration must cause a clear startup failure."
 */
const REQUIRED_IN_PRODUCTION = [
  "DATABASE_URL",
  "AUTH_JWT_SECRET",
  "AUTH_SESSION_SECRET",
  "FIELD_ENCRYPTION_KEY",
] as const;

export function loadConfig() {
  const env = process.env.NODE_ENV ?? "development";
  if (env === "production") {
    const missing = REQUIRED_IN_PRODUCTION.filter((key) => !process.env[key]);
    if (missing.length > 0) {
      throw new Error(
        `Refusing to start in production: missing required security configuration: ${missing.join(", ")}`
      );
    }
  }
  return {
    env,
    port: Number(process.env.PORT ?? 4000),
    corsAllowedOrigins: (process.env.CORS_ALLOWED_ORIGINS ?? "http://localhost:3000").split(","),
    rateLimit: {
      windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS ?? 60000),
      max: Number(process.env.RATE_LIMIT_MAX ?? 100),
    },
  };
}
