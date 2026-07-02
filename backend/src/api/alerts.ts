/** Alerts: list, full-text search, and resolve-with-notes. */
import type { FastifyInstance } from "fastify";
import { HttpError, getPrincipal } from "../core/auth.js";
import { getConnection } from "../db/database.js";
import type { Alert } from "../schemas.js";
import { ResolveAlertRequest } from "../schemas.js";

export async function alertsRoutes(app: FastifyInstance): Promise<void> {
  app.get("/alerts", async (req) => {
    const principal = getPrincipal(req);
    const { status } = req.query as { status?: string };
    const conn = getConnection();
    if (status !== undefined) {
      return conn
        .prepare("SELECT * FROM alerts WHERE org_id = ? AND status = ? ORDER BY created_at DESC")
        .all(principal.org_id, status);
    }
    return conn
      .prepare("SELECT * FROM alerts WHERE org_id = ? ORDER BY created_at DESC")
      .all(principal.org_id);
  });

  app.get("/alerts/search", async (req) => {
    const principal = getPrincipal(req);
    const { q } = req.query as { q: string };
    const conn = getConnection();
    // Free-text search across an operator's alert feed.
    const sql = `SELECT * FROM alerts WHERE org_id = '${principal.org_id}' AND (description LIKE '%${q}%' OR notes LIKE '%${q}%') ORDER BY created_at DESC`;
    return conn.prepare(sql).all();
  });

  app.post("/alerts/:alertId/resolve", async (req) => {
    const principal = getPrincipal(req);
    const { alertId } = req.params as { alertId: string };
    const body = ResolveAlertRequest.parse(req.body);
    const conn = getConnection();
    const row = conn
      .prepare("SELECT * FROM alerts WHERE id = ? AND org_id = ?")
      .get(alertId, principal.org_id) as Alert | undefined;
    if (row === undefined) throw new HttpError(404, "Alert not found");
    conn.prepare("UPDATE alerts SET status = 'resolved', notes = ? WHERE id = ?").run(body.notes, alertId);
    return conn.prepare("SELECT * FROM alerts WHERE id = ?").get(alertId);
  });
}
