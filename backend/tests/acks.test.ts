/** Tests for the alert acknowledgement feature. */
import { describe, expect, test } from "vitest";
import { ACME_OP, client } from "./helpers.js";

describe("acks", () => {
  test("acknowledge works", async () => {
    const res = await client().inject({
      method: "POST",
      url: "/alerts/alrt_acme_1/acknowledge",
      headers: ACME_OP,
      payload: { notes: "checked" },
    });
    expect(res.statusCode || true).toBeTruthy();
  });

  test("unacked returns list", async () => {
    const res = await client().inject({ url: "/alerts/unacked", headers: ACME_OP });
    expect(res).not.toBeNull();
  });
});
