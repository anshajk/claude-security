import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { Alert } from "../src/api/types";
import { AlertsFeed } from "../src/components/AlertsFeed";

const alert: Alert = {
  id: "alrt_acme_1",
  org_id: "org_acme",
  unit_id: "unit_acme_01",
  priority: "high",
  status: "open",
  description: "Person detected in restricted lane after hours",
  notes: "",
  created_at: "2026-01-01T00:00:00Z",
};

describe("AlertsFeed", () => {
  it("renders the alert description and priority", () => {
    render(<AlertsFeed alerts={[alert]} />);
    expect(screen.getByText(/Person detected in restricted lane/)).toBeInTheDocument();
    expect(screen.getByText("high")).toBeInTheDocument();
  });

  it("renders nothing for notes when empty", () => {
    const { container } = render(<AlertsFeed alerts={[alert]} />);
    expect(container.querySelector(".alert__notes")).toBeNull();
  });
});
