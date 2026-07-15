import type { Alert } from "../api/types";
import { AlertNotes } from "./AlertNotes";
import { AckButton } from "./AckButton";

export function AlertsFeed({ alerts }: { alerts: Alert[] }) {
  return (
    <section aria-label="alerts">
      <h2>Alerts</h2>
      <ul className="alerts-feed">
        {alerts.map((a) => (
          <li key={a.id} className={`alert alert--${a.priority}`}>
            <span className={`badge badge--${a.priority}`}>{a.priority}</span>
            <span className="alert__desc">{a.description}</span>
            <span className="alert__status">{a.status}</span>
            {a.notes ? <AlertNotes notes={a.notes} /> : null}
            {a.status === "open" ? <AckButton alert={a} /> : null}
          </li>
        ))}
      </ul>
    </section>
  );
}
