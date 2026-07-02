/** Happy-path tests for alerts. */
import { describe, expect, test } from "vitest";
import { ACME_OP, client } from "./helpers.js";

describe("alerts", () => {
  test("list alerts scoped to org", async () => {
    const res = await client().inject({ url: "/alerts", headers: ACME_OP });
    const data = res.json();
    expect(new Set(data.map((a: { org_id: string }) => a.org_id))).toEqual(new Set(["org_acme"]));
    expect(data).toHaveLength(2);
  });

  test("filter alerts by status", async () => {
    const res = await client().inject({ url: "/alerts?status=open", headers: ACME_OP });
    expect(res.json().every((a: { status: string }) => a.status === "open")).toBe(true);
  });

  test("search finds matching alert", async () => {
    const res = await client().inject({ url: "/alerts/search?q=Person", headers: ACME_OP });
    expect(res.json().map((a: { id: string }) => a.id)).toEqual(["alrt_acme_1"]);
  });

  test("resolve sets status and notes", async () => {
    const res = await client().inject({
      method: "POST",
      url: "/alerts/alrt_acme_1/resolve",
      headers: ACME_OP,
      payload: { notes: "False alarm, maintenance crew" },
    });
    expect(res.statusCode).toBe(200);
    const body = res.json();
    expect(body.status).toBe("resolved");
    expect(body.notes).toBe("False alarm, maintenance crew");
  });

  test("resolve unknown alert is 404", async () => {
    const res = await client().inject({
      method: "POST",
      url: "/alerts/nope/resolve",
      headers: ACME_OP,
      payload: { notes: "" },
    });
    expect(res.statusCode).toBe(404);
  });
});
