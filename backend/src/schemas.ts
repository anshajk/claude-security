/** Zod schemas + types for request/response bodies. */
import { z } from "zod";

export const UnitSchema = z.object({
  id: z.string(),
  org_id: z.string(),
  site_id: z.string(),
  label: z.string(),
  status: z.string(),
  battery_pct: z.number().int(),
  signal_dbm: z.number().int(),
});
export type Unit = z.infer<typeof UnitSchema>;

export const UnitHealthSchema = z.object({
  unit_id: z.string(),
  status: z.string(),
  battery_pct: z.number().int(),
  signal_dbm: z.number().int(),
});
export type UnitHealth = z.infer<typeof UnitHealthSchema>;

export const AlertSchema = z.object({
  id: z.string(),
  org_id: z.string(),
  unit_id: z.string(),
  priority: z.string(),
  status: z.string(),
  description: z.string(),
  notes: z.string(),
  created_at: z.string(),
});
export type Alert = z.infer<typeof AlertSchema>;

export const ClipSchema = z.object({
  id: z.string(),
  org_id: z.string(),
  unit_id: z.string(),
  recorded_at: z.string(),
  storage_url: z.string(),
});
export type Clip = z.infer<typeof ClipSchema>;

export const ResolveAlertRequest = z.object({
  notes: z.string().max(2000).default(""),
});

export const CallbackRequest = z.object({
  url: z.string(),
});

export const DeterrentRequest = z.object({
  kind: z.string(),
});
