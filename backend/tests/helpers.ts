import type { FastifyInstance } from "fastify";
import { beforeEach } from "vitest";
import { initDb } from "../src/db/database.js";
import { buildApp } from "../src/server.js";

export const ACME_OP = { authorization: "Bearer acme-operator-token" };
export const ACME_ADMIN = { authorization: "Bearer acme-admin-token" };
export const GLOBEX_OP = { authorization: "Bearer globex-operator-token" };

let app: FastifyInstance;

beforeEach(() => {
  initDb(true);
  app = buildApp();
});

export const client = () => app;
