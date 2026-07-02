/** Clips: access to recorded footage metadata. */
import type { FastifyInstance } from "fastify";
import { HttpError, getPrincipal } from "../core/auth.js";
import { getConnection } from "../db/database.js";

export async function clipsRoutes(app: FastifyInstance): Promise<void> {
  app.get("/clips/:clipId", async (req) => {
    getPrincipal(req);
    const { clipId } = req.params as { clipId: string };
    const row = getConnection().prepare("SELECT * FROM clips WHERE id = ?").get(clipId);
    if (row === undefined) throw new HttpError(404, "Clip not found");
    return row;
  });
}
