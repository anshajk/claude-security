import { useEffect, useState } from "react";
import { getAlerts, getUnits } from "../api/client";
import type { Alert, Unit } from "../api/types";
import { AlertsFeed } from "../components/AlertsFeed";
import { UnitsGrid } from "../components/UnitsGrid";

export function Dashboard() {
  const [units, setUnits] = useState<Unit[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getUnits(), getAlerts()])
      .then(([u, a]) => {
        setUnits(u);
        setAlerts(a);
      })
      .catch((e: unknown) => setError(e instanceof Error ? e.message : "Unknown error"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading Command Center…</p>;
  if (error) return <p role="alert">Could not load data: {error}</p>;

  return (
    <main className="dashboard">
      <UnitsGrid units={units} />
      <AlertsFeed alerts={alerts} />
    </main>
  );
}
