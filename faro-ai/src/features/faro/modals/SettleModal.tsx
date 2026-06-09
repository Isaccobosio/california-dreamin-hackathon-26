import { useState } from "react";
import Icon from "../components/Icon";
import ModalShell from "./ModalShell";
import type { FaroAction } from "../types";

interface Props {
  a: FaroAction | null;
  onCancel: () => void;
  onConfirm: (d: { date: string; conto: string }) => void;
}

const CONTI = ["Banca Intesa Sanpaolo", "Banca Mediolanum", "UniCredit", "Cassa contanti", "PayPal Business"];
const fmtDate = (d: string) => {
  const p = d.split("-");
  return p.length === 3 ? `${p[2]}/${p[1]}/${p[0]}` : d;
};

/** "Segna come saldata": data + conto di saldo. */
export default function SettleModal({ a, onCancel, onConfirm }: Props) {
  const [date, setDate] = useState("2026-06-08");
  const [conto, setConto] = useState(CONTI[0]);
  if (!a) return null;

  return (
    <ModalShell onClose={onCancel} className="wide" style={{ width: 440 }}>
      <div className="pv-head">
        <div className="modal-ic sm" style={{ background: "linear-gradient(135deg, var(--green), #4FC58C)", boxShadow: "none" }}>
          <Icon name="Money" size={18} />
        </div>
        <div className="grow">
          <h3>Segna come saldata</h3>
          <div className="pv-sub">
            {a.client} · {a.amount}
          </div>
        </div>
        <button className="x" onClick={onCancel}>
          <Icon name="X" size={17} />
        </button>
      </div>

      <div className="st-body">
        <div className="pv-field">
          <label>Data di saldo</label>
          <input className="pv-inp" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
        <div className="pv-field">
          <label>Conto di saldo</label>
          <select className="pv-inp" value={conto} onChange={(e) => setConto(e.target.value)}>
            {CONTI.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="modal-foot">
        <button className="btn ghost" onClick={onCancel}>
          Annulla
        </button>
        <button className="btn blue" style={{ marginLeft: "auto" }} onClick={() => onConfirm({ date: fmtDate(date), conto })}>
          <Icon name="Check" size={15} />
          Conferma saldo
        </button>
      </div>
    </ModalShell>
  );
}
