import { afterEach, describe, expect, it, vi } from "vitest";
import { getUnits } from "../src/api/client";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("api client", () => {
  it("sends a bearer token and parses JSON", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [{ id: "unit_acme_01" }],
    });
    vi.stubGlobal("fetch", fetchMock);

    const units = await getUnits();

    expect(units).toEqual([{ id: "unit_acme_01" }]);
    const [, init] = fetchMock.mock.calls[0];
    expect(init.headers.Authorization).toMatch(/^Bearer /);
  });

  it("throws on a non-ok response", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, status: 500, statusText: "Server Error" }));
    await expect(getUnits()).rejects.toThrow(/500/);
  });
});
