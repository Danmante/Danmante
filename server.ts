import { createApp } from "./app";
import { loadConfig } from "./config";

async function main() {
  const config = loadConfig();
  const app = await createApp(config);
  await app.listen({ port: config.port, host: "0.0.0.0" });
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : "Unknown startup error";
  console.error("Fatal startup error:", message);
  process.exit(1);
});
