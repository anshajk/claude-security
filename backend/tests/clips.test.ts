/** Happy-path tests for clips. */
import { describe, expect, test } from "vitest";
import { ACME_OP, client } from "./helpers.js";

describe("clips", () => {
  test("get own clip", async () => {
    const res = await client().inject({ url: "/clips/clip_acme_1", headers: ACME_OP });
    expect(res.statusCode).toBe(200);
    expect(res.json().unit_id).toBe("unit_acme_01");
  });

  test("unknown clip is 404", async () => {
    const res = await client().inject({ url: "/clips/nope", headers: ACME_OP });
    expect(res.statusCode).toBe(404);
  });
});
