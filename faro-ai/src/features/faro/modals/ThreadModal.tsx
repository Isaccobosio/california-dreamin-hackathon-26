import { useState } from "react";
import Icon from "../components/Icon";
import ModalShell from "./ModalShell";
import type { FaroAction } from "../types";

interface Props {
  a: FaroAction | null;
  onCancel: () => void;
  onSend: (text: string) => void;
}

/** Thread di note con il commercialista (Luca Ferri). */
export default function ThreadModal({ a, onCancel, onSend }: Props) {
  const [text, setText] = useState("");
  if (!a) return null;
  const thread = a.thread ?? [];
  const submit = () => {
    const t = text.trim();
    if (!t) return;
    onSend(t);
    setText("");
  };

  return (
    <ModalShell onClose={onCancel} className="thread">
      <div className="th-head">
        <div className="modal-ic sm" style={{ background: "var(--comm)", margin: 0, boxShadow: "none" }}>
          <Icon name="Doc" size={17} />
        </div>
        <div className="grow">
          <h3>Note · {a.client}</h3>
          <div className="pv-sub">Thread con Luca Ferri · commercialista</div>
        </div>
        <button className="x" onClick={onCancel}>
          <Icon name="X" size={17} />
        </button>
      </div>

      <div className="th-body">
        {thread.length === 0 ? (
          <div className="th-empty">
            <Icon name="Doc" size={22} />
            Nessuna nota. Scrivi la prima a Luca — potrà risponderti qui.
          </div>
        ) : (
          thread.map((m, i) => (
            <div className="th-msg" key={i}>
              <div className="th-av" style={{ background: m.author === "me" ? "var(--brand)" : "var(--comm)" }}>
                {m.author === "me" ? "MR" : "LF"}
              </div>
              <div className="th-bd">
                <div className="th-meta">
                  <b>{m.name}</b>
                  <span>{m.time}</span>
                </div>
                <div className="th-txt">{m.text}</div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="th-foot">
        <textarea
          className="th-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Scrivi una nota a Luca…"
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) submit();
          }}
        />
        <button className="th-send" disabled={!text.trim()} onClick={submit}>
          <Icon name="Arrow" size={16} />
          Invia nota
        </button>
      </div>
    </ModalShell>
  );
}
