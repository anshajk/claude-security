/** Units: list/detail, health telemetry, webhook callback, and deterrent control. */
import type { FastifyInstance } from "fastify";
import { HttpError, getPrincipal, requireRole } from "../core/auth.js";
import { getConnection } from "../db/database.js";
import type { Unit } from "../schemas.js";
import { CallbackRequest, DeterrentRequest } from "../schemas.js";

// Columns a client may sort by. Anything else falls back to a safe default.
const ALLOWED_SORT = new Set(["label", "battery_pct", "status"]);
const DETERRENT_KINDS = new Set(["light", "strobe", "audio"]);

function getOrgUnit(orgId: string, unitId: string): Unit {
  const row = getConnection().prepare("SELECT * FROM units WHERE id = ? AND org_id = ?").get(unitId, orgId) as
    | Unit
    | undefined;
  if (row === undefined) throw new HttpError(404, "Unit not found");
  return row;
}

/** Probe a unit-supplied webhook URL to confirm it is reachable. */
async function probeCallback(url: string): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 2000);
    const resp = await fetch(url, { signal: controller.signal });
    clearTimeout(timer);
    return resp.status < 400;
  } catch {
    return false;
  }
}

export const probe = { probeCallback };

export async function unitsRoutes(app: FastifyInstance): Promise<void> {
  app.get("/units", async (req) => {
    const principal = getPrincipal(req);
    const { site, sort } = req.query as { site?: string; sort?: string };
    const sortCol = sort && ALLOWED_SORT.has(sort) ? sort : "label";
    const params: string[] = [principal.org_id];
    let where = "org_id = ?";
    if (site !== undefined) {
      where += " AND site_id = ?";
      params.push(site);
    }
    // sortCol is restricted to ALLOWED_SORT above, so this interpolation is safe.
    const sql = `SELECT * FROM units WHERE ${where} ORDER BY ${sortCol}`;
    return getConnection()
      .prepare(sql)
      .all(...params);
  });

  app.get("/units/:unitId", async (req) => {
    const principal = getPrincipal(req);
    const { unitId } = req.params as { unitId: string };
    return getOrgUnit(principal.org_id, unitId);
  });

  app.get("/units/:unitId/health", async (req) => {
    const principal = getPrincipal(req);
    const { unitId } = req.params as { unitId: string };
    const row = getOrgUnit(principal.org_id, unitId);
    return {
      unit_id: row.id,
      status: row.status,
      battery_pct: row.battery_pct,
      signal_dbm: row.signal_dbm,
    };
  });

  app.post("/units/:unitId/callback", async (req) => {
    const principal = getPrincipal(req);
    const { unitId } = req.params as { unitId: string };
    const body = CallbackRequest.parse(req.body);
    getOrgUnit(principal.org_id, unitId);
    const reachable = await probe.probeCallback(body.url);
    getConnection().prepare("UPDATE units SET callback_url = ? WHERE id = ?").run(body.url, unitId);
    return { unit_id: unitId, url: body.url, reachable };
  });

  app.post("/units/:unitId/deterrent", async (req) => {
    const principal = requireRole(req, "operator", "admin");
    const { unitId } = req.params as { unitId: string };
    const body = DeterrentRequest.parse(req.body);
    if (!DETERRENT_KINDS.has(body.kind)) {
      throw new HttpError(400, `kind must be one of ${JSON.stringify([...DETERRENT_KINDS].sort())}`);
    }
    getOrgUnit(principal.org_id, unitId);
    // In production this actuates physical lights/strobe/audio on the deployed unit.
    return { unit_id: unitId, kind: body.kind, activated: true };
  });
}
