/**
 * Token authentication: maps an `Authorization: Bearer <token>` header to a principal.
 *
 * The principal carries the caller's `org_id` and `role` — the inputs every endpoint needs to make
 * correct multi-tenant authorization decisions. (Whether each endpoint actually *uses* them is the
 * subject of the Day 3 security lab.)
 */
import type { FastifyRequest } from "fastify";
import { getConnection } from "../db/database.js";

export class HttpError extends Error {
  statusCode: number;
  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
  }
}

export interface Principal {
  user_id: string;
  org_id: string;
  role: string; // 'operator' | 'admin'
}

export function getPrincipal(req: FastifyRequest): Principal {
  const authorization = (req.headers.authorization ?? "") as string;
  const [scheme, token] = authorization.split(" ", 2);
  if (scheme?.toLowerCase() !== "bearer" || !token) {
    throw new HttpError(401, "Missing or malformed Authorization header (expected 'Bearer <token>').");
  }
  const row = getConnection().prepare("SELECT id, org_id, role FROM users WHERE token = ?").get(token) as
    | { id: string; org_id: string; role: string }
    | undefined;
  if (row === undefined) throw new HttpError(401, "Invalid token.");
  return { user_id: row.id, org_id: row.org_id, role: row.role };
}

/** Require the principal to hold one of `roles`. */
export function requireRole(req: FastifyRequest, ...roles: string[]): Principal {
  const principal = getPrincipal(req);
  if (!roles.includes(principal.role)) {
    throw new HttpError(403, `Requires role in ${JSON.stringify(roles)}; you are '${principal.role}'.`);
  }
  return principal;
}
