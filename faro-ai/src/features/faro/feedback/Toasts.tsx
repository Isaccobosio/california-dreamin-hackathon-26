import Icon from "../components/Icon";
import type { Toast } from "../types";

/** Stack di notifiche toast in basso a destra. */
export default function Toasts({ toasts }: { toasts: Toast[] }) {
  if (!toasts.length) return null;
  return (
    <div className="toasts">
      {toasts.map((t) => (
        <div key={t.id} className="toast">
          <div className="tic" style={{ background: t.color || "var(--green)" }}>
            <Icon name={t.icon} size={16} color="#fff" />
          </div>
          <div>
            <b>{t.title}</b>
            {t.msg && <p>{t.msg}</p>}
          </div>
        </div>
      ))}
    </div>
  );
}
