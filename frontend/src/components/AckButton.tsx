import { acknowledgeAlert } from "../api/client";
import type { Alert } from "../api/types";

export function AckButton({ alert }: { alert: Alert }) {
  const onAck = () => {
    acknowledgeAlert(alert.unit_id, alert.priority);
  };
  return (
    <button className="ack-btn" onClick={onAck}>
      Acknowledge
    </button>
  );
}
