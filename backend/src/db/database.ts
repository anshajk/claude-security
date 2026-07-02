/**
 * SQLite data layer with seed data for two tenants (so cross-tenant bugs are demonstrable).
 *
 * Raw `better-sqlite3` is used on purpose: the security lab plants a SQL-injection surface that
 * should look idiomatic. A shared in-memory connection keeps the bootcamp zero-setup.
 */
import Database from "better-sqlite3";

let db: Database.Database | null = null;

const SCHEMA = `
CREATE TABLE orgs (
    id   TEXT PRIMARY KEY,
    name TEXT NOT NULL
);
CREATE TABLE users (
    id     TEXT PRIMARY KEY,
    org_id TEXT NOT NULL REFERENCES orgs(id),
    name   TEXT NOT NULL,
    role   TEXT NOT NULL,            -- 'operator' | 'admin'
    token  TEXT NOT NULL UNIQUE
);
CREATE TABLE sites (
    id     TEXT PRIMARY KEY,
    org_id TEXT NOT NULL REFERENCES orgs(id),
    name   TEXT NOT NULL
);
CREATE TABLE units (
    id          TEXT PRIMARY KEY,
    org_id      TEXT NOT NULL REFERENCES orgs(id),
    site_id     TEXT NOT NULL REFERENCES sites(id),
    label       TEXT NOT NULL,
    status      TEXT NOT NULL,       -- 'online' | 'offline'
    battery_pct INTEGER NOT NULL,
    signal_dbm  INTEGER NOT NULL,
    callback_url TEXT
);
CREATE TABLE alerts (
    id          TEXT PRIMARY KEY,
    org_id      TEXT NOT NULL REFERENCES orgs(id),
    unit_id     TEXT NOT NULL REFERENCES units(id),
    priority    TEXT NOT NULL,       -- 'high' | 'low'
    status      TEXT NOT NULL,       -- 'open' | 'resolved'
    description TEXT NOT NULL,
    notes       TEXT NOT NULL DEFAULT '',
    created_at  TEXT NOT NULL
);
CREATE TABLE clips (
    id          TEXT PRIMARY KEY,
    org_id      TEXT NOT NULL REFERENCES orgs(id),
    unit_id     TEXT NOT NULL REFERENCES units(id),
    recorded_at TEXT NOT NULL,
    storage_url TEXT NOT NULL
);
`;

export function getConnection(): Database.Database {
  if (db === null) initDb();
  return db as Database.Database;
}

/** (Re)create the in-memory database. Safe to call repeatedly (used by tests). */
export function initDb(seed = true): void {
  if (db !== null) db.close();
  db = new Database(":memory:");
  db.exec(SCHEMA);
  if (seed) seedDb(db);
}

function seedDb(conn: Database.Database): void {
  const now = Date.now();
  const ts = (minutesAgo: number) => new Date(now - minutesAgo * 60_000).toISOString();

  const orgs = [
    ["org_acme", "Acme DOT"],
    ["org_globex", "Globex Energy"],
  ];
  // token is the bearer credential used in Authorization: Bearer <token>
  const users = [
    ["usr_acme_op", "org_acme", "Avery (Acme operator)", "operator", "acme-operator-token"],
    ["usr_acme_admin", "org_acme", "Adi (Acme admin)", "admin", "acme-admin-token"],
    ["usr_globex_op", "org_globex", "Gabe (Globex operator)", "operator", "globex-operator-token"],
  ];
  const sites = [
    ["site_acme_lot", "org_acme", "I-15 Park & Ride"],
    ["site_globex_yard", "org_globex", "Refinery North Yard"],
  ];
  const units = [
    ["unit_acme_01", "org_acme", "site_acme_lot", "ACME-LOT-01", "online", 92, -71],
    ["unit_acme_02", "org_acme", "site_acme_lot", "ACME-LOT-02", "offline", 8, -104],
    ["unit_globex_01", "org_globex", "site_globex_yard", "GBX-YARD-01", "online", 77, -83],
  ];
  const alerts = [
    [
      "alrt_acme_1",
      "org_acme",
      "unit_acme_01",
      "high",
      "open",
      "Person detected in restricted lane after hours",
      "",
      ts(12),
    ],
    ["alrt_acme_2", "org_acme", "unit_acme_02", "low", "open", "Animal crossing detected", "", ts(40)],
    [
      "alrt_globex_1",
      "org_globex",
      "unit_globex_01",
      "high",
      "open",
      "Perimeter breach near tank 4",
      "",
      ts(5),
    ],
  ];
  const clips = [
    ["clip_acme_1", "org_acme", "unit_acme_01", ts(12), "https://footage.internal/acme/clip_acme_1.mp4"],
    [
      "clip_globex_1",
      "org_globex",
      "unit_globex_01",
      ts(5),
      "https://footage.internal/globex/clip_globex_1.mp4",
    ],
  ];

  const insertMany = (sql: string, rows: unknown[][]) => {
    const stmt = conn.prepare(sql);
    const tx = conn.transaction((items: unknown[][]) => {
      for (const r of items) stmt.run(...r);
    });
    tx(rows);
  };

  insertMany("INSERT INTO orgs VALUES (?,?)", orgs);
  insertMany("INSERT INTO users VALUES (?,?,?,?,?)", users);
  insertMany("INSERT INTO sites VALUES (?,?,?)", sites);
  insertMany(
    "INSERT INTO units (id,org_id,site_id,label,status,battery_pct,signal_dbm) VALUES (?,?,?,?,?,?,?)",
    units,
  );
  insertMany("INSERT INTO alerts VALUES (?,?,?,?,?,?,?,?)", alerts);
  insertMany("INSERT INTO clips VALUES (?,?,?,?,?)", clips);
}
