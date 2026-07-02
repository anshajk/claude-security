import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { Unit } from "../src/api/types";
import { UnitsGrid } from "../src/components/UnitsGrid";

const unit: Unit = {
  id: "unit_acme_01",
  org_id: "org_acme",
  site_id: "site_acme_lot",
  label: "ACME-LOT-01",
  status: "online",
  battery_pct: 92,
  signal_dbm: -71,
};

describe("UnitsGrid", () => {
  it("shows unit label and battery", () => {
    render(<UnitsGrid units={[unit]} />);
    expect(screen.getByText("ACME-LOT-01")).toBeInTheDocument();
    expect(screen.getByText("92%")).toBeInTheDocument();
  });
});
