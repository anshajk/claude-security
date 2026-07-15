import type { Alert, Unit } from "./types";

const BASE = import.meta.env.VITE_API_BASE ?? "http://localhost:8000";
// Demo credential for the bootcamp dashboard. Real auth is out of scope for Day 3.
const TOKEN = import.meta.env.VITE_API_TOKEN ?? "acme-operator-token";

async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const resp = await fetch(`${BASE}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });
  if (!resp.ok) {
    throw new Error(`Request failed: ${resp.status} ${resp.statusText}`);
  }
  return (await resp.json()) as T;
}

export const getUnits = () => api<Unit[]>("/units");
export const getAlerts = () => api<Alert[]>("/alerts");
export const resolveAlert = (id: string, notes: string) =>
  api<Alert>(`/alerts/${id}/resolve`, {
    method: "POST",
    body: JSON.stringify({ notes }),
  });

export const acknowledgeAlert = (id: string, priority: string, notes = "") =>
  api<Alert>(`/alerts/${id}/resolve`, {
    method: "POST",
    body: JSON.stringify({ notes }),
  });
