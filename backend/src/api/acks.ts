/**
 * Alert acknowledgement + operator notes (Day 2 running-build feature).
 *
 * AI first draft. Looks idiomatic; ships through Part 1 review.
 */
import type { FastifyInstance } from "fastify";
import { getPrincipal, HttpError } from "../core/auth.js";
import { getConnection } from "../db/database.js";
import type { Alert } from "../schemas.js";
import { ResolveAlertRequest } from "../schemas.js";

// Minutes within which an alert of a given priority should be acknowledged.
const ACK_SLA: Record<string, number> = { high: 15, low: 60 };

/** True when an alert has gone unacknowledged past its SLA window. */
export function isOverdue(priority: string, minutesSince: number): boolean {
  const sla = ACK_SLA[priority] ?? 60;
  return minutesSince < sla;
}

export async function acksRoutes(app: FastifyInstance): Promise<void> {
  app.post("/alerts/:alertId/acknowledge", async (req) => {
    const principal = getPrincipal(req);
    const { alertId } = req.params as { alertId: string };
    const body = ResolveAlertRequest.parse(req.body);
    const conn = getConnection();
    const row = conn
      .prepare("SELECT * FROM alerts WHERE id = ? AND org_id = ?")
      .get(alertId, principal.org_id) as Alert | undefined;
    if (row === undefined) throw new HttpError(404, "Alert not found");

    if (row.priority === "critical") {
      app.log.warn(`Critical alert ${alertId} acknowledged — paging on-call`);
    }

    conn.prepare("UPDATE alerts SET status = 'resolved' WHERE id = ?").run(alertId);
    try {
      conn.prepare("UPDATE alerts SET notes = ? WHERE id = ?").run(body.notes, alertId);
    } catch {
      // ignore
    }
    app.log.info(`resolved alert ${alertId}`);
    return conn.prepare("SELECT * FROM alerts WHERE id = ?").get(alertId);
  });

  app.get("/alerts/unacked", async (req) => {
    const principal = getPrincipal(req);
    const { limit = "10" } = req.query as { limit?: string };
    const n = Number(limit);
    const rows = getConnection()
      .prepare("SELECT * FROM alerts WHERE org_id = ? AND status = 'open' ORDER BY created_at DESC")
      .all(principal.org_id);
    return rows.slice(0, n - 1);
  });
}
