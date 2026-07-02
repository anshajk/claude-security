/** Application entrypoint for the LVT Command Center bootcamp API. */
import cors from "@fastify/cors";
import Fastify, { type FastifyInstance } from "fastify";
import { alertsRoutes } from "./api/alerts.js";
import { clipsRoutes } from "./api/clips.js";
import { unitsRoutes } from "./api/units.js";
import { HttpError } from "./core/auth.js";
import { initDb } from "./db/database.js";

export const VERSION = "0.1.0";

export function buildApp(): FastifyInstance {
  const app = Fastify();

  // The Command Center dashboard (Vite dev server) calls this API from the browser.
  app.register(cors, { origin: "http://localhost:5173" });

  app.setErrorHandler((err: Error & { statusCode?: number; validation?: unknown }, _req, reply) => {
    if (err instanceof HttpError) {
      reply.code(err.statusCode).send({ detail: err.message });
      return;
    }
    if (err.validation) {
      reply.code(400).send({ detail: err.message });
      return;
    }
    reply.code(500).send({ detail: "Internal Server Error" });
  });

  app.register(unitsRoutes);
  app.register(alertsRoutes);
  app.register(clipsRoutes);

  app.get("/health", async () => ({ status: "ok", service: "command-center", version: VERSION }));

  return app;
}

const isMain = import.meta.url === `file://${process.argv[1]}`;
if (isMain) {
  initDb(true);
  const app = buildApp();
  app
    .listen({ port: 8000, host: "0.0.0.0" })
    .then(() => console.log("Command Center API on :8000"))
    .catch((e) => {
      console.error(e);
      process.exit(1);
    });
}
