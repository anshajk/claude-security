/**
 * Happy-path tests for units. These pass even though the service has planted weaknesses
 * (idiomatic, green, still insecure) — the central Day 3 lesson.
 */
import { describe, expect, test, vi } from "vitest";
import { probe } from "../src/api/units.js";
import { ACME_OP, client } from "./helpers.js";

describe("units", () => {
  test("health", async () => {
    const res = await client().inject({ url: "/health" });
    expect(res.json().status).toBe("ok");
  });

  test("unauthenticated is rejected", async () => {
    const res = await client().inject({ url: "/units" });
    expect(res.statusCode).toBe(401);
  });

  test("list units scoped to org", async () => {
    const res = await client().inject({ url: "/units", headers: ACME_OP });
    expect(res.statusCode).toBe(200);
    const data = res.json();
    expect(data).toHaveLength(2);
    expect(new Set(data.map((u: { org_id: string }) => u.org_id))).toEqual(new Set(["org_acme"]));
  });

  test("list units filter and sort", async () => {
    const res = await client().inject({
      url: "/units?site=site_acme_lot&sort=battery_pct",
      headers: ACME_OP,
    });
    expect(res.statusCode).toBe(200);
    const batteries = res.json().map((u: { battery_pct: number }) => u.battery_pct);
    expect(batteries).toEqual([...batteries].sort((a, b) => a - b));
  });

  test("invalid sort falls back safely", async () => {
    // A non-whitelisted sort value must not break the query (or inject SQL).
    const res = await client().inject({ url: "/units?sort=label;DROP TABLE units", headers: ACME_OP });
    expect(res.statusCode).toBe(200);
    const again = await client().inject({ url: "/units", headers: ACME_OP });
    expect(again.statusCode).toBe(200); // table still there
  });

  test("get unit", async () => {
    const res = await client().inject({ url: "/units/unit_acme_01", headers: ACME_OP });
    expect(res.json().label).toBe("ACME-LOT-01");
  });

  test("get other org unit is 404", async () => {
    const res = await client().inject({ url: "/units/unit_globex_01", headers: ACME_OP });
    expect(res.statusCode).toBe(404);
  });

  test("unit health", async () => {
    const res = await client().inject({ url: "/units/unit_acme_01/health", headers: ACME_OP });
    expect(res.json().battery_pct).toBe(92);
  });

  test("deterrent activates", async () => {
    const res = await client().inject({
      method: "POST",
      url: "/units/unit_acme_01/deterrent",
      headers: ACME_OP,
      payload: { kind: "strobe" },
    });
    expect(res.statusCode).toBe(200);
    expect(res.json()).toEqual({ unit_id: "unit_acme_01", kind: "strobe", activated: true });
  });

  test("deterrent rejects bad kind", async () => {
    const res = await client().inject({
      method: "POST",
      url: "/units/unit_acme_01/deterrent",
      headers: ACME_OP,
      payload: { kind: "taser" },
    });
    expect(res.statusCode).toBe(400);
  });

  test("callback records url", async () => {
    vi.spyOn(probe, "probeCallback").mockResolvedValue(true);
    const res = await client().inject({
      method: "POST",
      url: "/units/unit_acme_01/callback",
      headers: ACME_OP,
      payload: { url: "https://example.com/hook" },
    });
    expect(res.statusCode).toBe(200);
    expect(res.json().reachable).toBe(true);
  });
});
