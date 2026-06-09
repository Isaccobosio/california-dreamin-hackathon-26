import Icon from "../components/Icon";
import type { ChatMessage as Msg } from "../types";

interface Props {
  m: Msg;
  onQuick: (q: string) => void;
}

/** Bolla di chat: utente (blu, a destra) o Faro/normo (a sinistra con icona). */
export default function ChatMessage({ m, onQuick }: Props) {
  if (m.role === "me") return <div className="msg me">{m.text}</div>;
  const isNormo = m.role === "normo";
  return (
    <div className="msg faro">
      <div className="mo" style={isNormo ? { background: "#F6E7CF", color: "#B4690E" } : undefined}>
        <Icon name={isNormo ? "Stamp" : "Sparkle"} size={13} />
      </div>
      <div className="bub">
        {m.text}
        {m.quick && (
          <div className="qbtns">
            {m.quick.map((q, i) => (
              <button key={i} className="qbtn" onClick={() => onQuick(q)}>
                {q}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
