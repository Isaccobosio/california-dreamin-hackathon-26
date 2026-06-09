import { useState } from "react";
import Icon from "../components/Icon";
import ModalShell from "./ModalShell";
import type { Artifact } from "../data/domain";

type EmailArt = Extract<Artifact, { kind: "email" }>;

interface Props {
  art: EmailArt;
  onCancel: () => void;
  onConfirm: (edited: boolean) => void;
}

/** Anteprima email di sollecito: destinatari, oggetto, corpo — modificabili. */
export default function EmailPreview({ art, onCancel, onConfirm }: Props) {
  const [recips, setRecips] = useState(art.recipients);
  const [subject, setSubject] = useState(art.subject);
  const [body, setBody] = useState(art.body);

  const setR = (i: number, k: "name" | "email", v: string) => setRecips((rs) => rs.map((r, j) => (j === i ? { ...r, [k]: v } : r)));
  const addR = () => setRecips((rs) => [...rs, { name: "", email: "" }]);
  const delR = (i: number) => setRecips((rs) => (rs.length > 1 ? rs.filter((_, j) => j !== i) : rs));

  return (
    <ModalShell onClose={onCancel} className="wide">
      <div className="pv-head">
        <div className="modal-ic sm" style={{ boxShadow: "none" }}>
          <Icon name="Send" size={18} />
        </div>
        <div className="grow">
          <h3>{art.title}</h3>
          <div className="pv-sub">{art.subtitle}</div>
        </div>
        <span className="pv-badge">
          <Icon name="Sparkle" size={12} />
          preparato da Faro
        </span>
      </div>

      <div className="pv-body">
        <div className="pv-field">
          <label>Destinatari</label>
          <div className="recips">
            {recips.map((r, i) => (
              <div className="recip" key={i}>
                <input className="pv-inp" placeholder="Nome" value={r.name} onChange={(e) => setR(i, "name", e.target.value)} />
                <input className="pv-inp" placeholder="email@dominio.it" value={r.email} onChange={(e) => setR(i, "email", e.target.value)} />
                <button className="recip-x" title="Rimuovi destinatario" onClick={() => delR(i)}>
                  <Icon name="X" size={14} />
                </button>
              </div>
            ))}
            <button className="recip-add" onClick={addR}>
              <Icon name="Plus" size={14} />
              Aggiungi destinatario
            </button>
          </div>
        </div>

        <div className="pv-field">
          <label>Data fattura</label>
          <div className="pv-info">
            <Icon name="Cal" size={14} />
            Fattura {art.num} · {art.date}
          </div>
        </div>

        <div className="pv-field">
          <label>Oggetto</label>
          <input className="pv-inp" value={subject} onChange={(e) => setSubject(e.target.value)} />
        </div>

        <div className="pv-field">
          <label>Messaggio</label>
          <textarea className="pv-text" style={{ minHeight: 150, boxShadow: "none", border: "1px solid var(--line)" }} value={body} onChange={(e) => setBody(e.target.value)} />
        </div>
      </div>

      <div className="modal-foot">
        <button className="btn ghost" onClick={onCancel}>
          Annulla
        </button>
        <button className="btn faro" style={{ marginLeft: "auto" }} onClick={() => onConfirm(true)}>
          <Icon name="Check" size={15} />
          Conferma e invia
        </button>
      </div>
    </ModalShell>
  );
}
