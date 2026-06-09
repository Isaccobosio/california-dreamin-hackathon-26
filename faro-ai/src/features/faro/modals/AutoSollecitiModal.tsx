import { useState } from "react";
import Icon from "../components/Icon";
import ModalShell from "./ModalShell";
import type { AutoSollecitiConfig } from "../hooks/useFaroBoard";

interface Props {
  client: string;
  onCancel: () => void;
  onConfirm: (cfg: AutoSollecitiConfig) => void;
}

/** Switch verde stile FIC (pm-sw on v). */
function Switch({ on, onClick }: { on: boolean; onClick: () => void }) {
  return <button className={`pm-sw${on ? " on v" : ""}`} onClick={onClick} role="switch" aria-checked={on} type="button"><i /></button>;
}

/** Modale "Attiva solleciti automatici": sequenza promemoria, scope, invio. */
export default function AutoSollecitiModal({ client, onCancel, onConfirm }: Props) {
  const [steps, setSteps] = useState<AutoSollecitiConfig["steps"]>([
    { id: "s1", on: true, when: "3 giorni prima della scadenza", tone: "Promemoria gentile" },
    { id: "s2", on: true, when: "Il giorno della scadenza", tone: "Cordiale" },
    { id: "s3", on: true, when: "7 giorni dopo la scadenza", tone: "Diretto" },
    { id: "s4", on: false, when: "15 giorni dopo la scadenza", tone: "Fermo (preavviso mora)" },
  ]);
  const [scope, setScope] = useState<"one" | "late">("one");
  const [stopOnPay, setStopOnPay] = useState(true);
  const [sendTime, setSendTime] = useState("09:00");

  const toggle = (id: string) => setSteps((ss) => ss.map((s) => (s.id === id ? { ...s, on: !s.on } : s)));

  const radio = (val: "one" | "late", label: string, sub: string) => (
    <button className={`as-opt${scope === val ? " on" : ""}`} onClick={() => setScope(val)} type="button">
      <span className="as-radio">{scope === val ? <i /> : null}</span>
      <span className="as-opt-tx">
        <b>{label}</b>
        <span>{sub}</span>
      </span>
    </button>
  );

  return (
    <ModalShell onClose={onCancel} className="as">
      <div className="pv-head">
        <div className="modal-ic sm" style={{ background: "linear-gradient(135deg, var(--faro), var(--faro-2))", boxShadow: "none" }}>
          <Icon name="Repeat" size={17} />
        </div>
        <div className="grow">
          <h3>Attiva solleciti automatici</h3>
          <div className="pv-sub">Faro invierà i promemoria da solo, secondo questa regola</div>
        </div>
        <button className="x" onClick={onCancel}>
          <Icon name="X" size={17} />
        </button>
      </div>

      <div className="as-body">
        <div className="as-note">
          <Icon name="Sparkle" size={15} />
          <span>{client} paga in media a 60 giorni. La regola invia una sequenza di promemoria via email finché la fattura non risulta saldata.</span>
        </div>

        <div className="as-sec">Sequenza promemoria</div>
        <div className="as-steps">
          {steps.map((s, i) => (
            <div className={`as-step${s.on ? "" : " off"}`} key={s.id}>
              <div className="as-num">{i + 1}</div>
              <div className="as-step-tx">
                <b>{s.when}</b>
                <span>Tono: {s.tone}</span>
              </div>
              <Switch on={s.on} onClick={() => toggle(s.id)} />
            </div>
          ))}
        </div>

        <div className="as-sec">A chi si applica</div>
        <div className="as-opts">
          {radio("one", `Solo ${client}`, "Attiva la regola per questo cliente")}
          {radio("late", "Tutti i clienti che pagano in ritardo", "Faro rileva chi sfora i termini e applica la regola")}
        </div>

        <div className="as-sec">Impostazioni invio</div>
        <div className="as-settings">
          <div className="as-set-row">
            <div className="as-set-tx">
              <b>Interrompi se la fattura viene saldata</b>
              <span>Niente promemoria inutili dopo l'incasso</span>
            </div>
            <Switch on={stopOnPay} onClick={() => setStopOnPay((v) => !v)} />
          </div>
          <div className="as-set-row">
            <div className="as-set-tx">
              <b>Orario di invio</b>
              <span>Quando partono i promemoria</span>
            </div>
            <input className="pv-inp" type="time" value={sendTime} onChange={(e) => setSendTime(e.target.value)} style={{ width: 110, flex: "none" }} />
          </div>
        </div>
      </div>

      <div className="modal-foot">
        <button className="btn ghost" onClick={onCancel}>
          Annulla
        </button>
        <button className="btn faro" style={{ marginLeft: "auto" }} onClick={() => onConfirm({ client, steps, scope, stopOnPay, sendTime })}>
          <Icon name="Check" size={15} />
          Attiva regola
        </button>
      </div>
    </ModalShell>
  );
}
