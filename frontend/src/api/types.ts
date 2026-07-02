export interface Unit {
  id: string;
  org_id: string;
  site_id: string;
  label: string;
  status: "online" | "offline";
  battery_pct: number;
  signal_dbm: number;
}

export interface Alert {
  id: string;
  org_id: string;
  unit_id: string;
  priority: "high" | "low";
  status: "open" | "resolved";
  description: string;
  notes: string;
  created_at: string;
}
