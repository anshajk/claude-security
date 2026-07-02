import type { Unit } from "../api/types";

export function UnitsGrid({ units }: { units: Unit[] }) {
  return (
    <section aria-label="units">
      <h2>Units</h2>
      <ul className="units-grid">
        {units.map((u) => (
          <li key={u.id} className={`unit unit--${u.status}`}>
            <span className="unit__label">{u.label}</span>
            <span className="unit__status">{u.status}</span>
            <span className="unit__battery">{u.battery_pct}%</span>
            <span className="unit__signal">{u.signal_dbm} dBm</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
