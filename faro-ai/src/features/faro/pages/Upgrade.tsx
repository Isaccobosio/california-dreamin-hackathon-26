import { useState } from "react";
import Icon from "../components/Icon";
import type { ToastInput } from "../hooks/useToast";

interface Props {
  onHome: () => void;
  onBack: () => void;
  notify: (t: ToastInput) => void;
}

interface Plan {
  id: string;
  name: string;
  tone: string;
  soft: string;
  mo: number;
  yr: number;
  ai: string;
  tag: string | null;
  current?: boolean;
  popular?: boolean;
  feats: string[];
}

const PLANS: Plan[] = [
  { id: "base", name: "Base", tone: "var(--ink-3)", soft: "var(--bg)", mo: 9, yr: 90, ai: "300", tag: null, feats: ["300 azioni AI / mese", "Solleciti e invii allo SDI", "1 utente", "Supporto via email"] },
  { id: "pro", name: "Pro", tone: "var(--faro)", soft: "var(--faro-soft)", mo: 24, yr: 240, ai: "2.000", tag: "Attuale", current: true, feats: ["2.000 azioni AI / mese", "Riconciliazioni bancarie automatiche", "Conferme ricorrenti", "3 utenti + commercialista", "Supporto prioritario"] },
  { id: "business", name: "Business", tone: "var(--brand)", soft: "var(--brand-soft)", mo: 49, yr: 490, ai: "6.000", tag: "Consigliato", popular: true, feats: ["6.000 azioni AI / mese", "Automazioni avanzate di Faro", "normo.AI illimitato", "10 utenti", "Account manager dedicato"] },
  { id: "unlimited", name: "Unlimited", tone: "var(--comm)", soft: "var(--comm-soft)", mo: 99, yr: 990, ai: "∞", tag: null, feats: ["Azioni AI illimitate", "Faro in piena autonomia", "API e integrazioni custom", "Utenti illimitati", "SLA garantito 24/7"] },
];

const euro = (n: number) => "€ " + n.toLocaleString("it-IT");

/** Una card piano. */
function PlanCard({ p, yearly, onPick }: { p: Plan; yearly: boolean; onPick: () => void }) {
  return (
    <div className={`up-card${p.popular ? " popular" : ""}${p.current ? " current" : ""}`} style={{ ["--pt" as string]: p.tone, ["--ps" as string]: p.soft }}>
      {p.tag && <span className="up-badge">{p.tag}</span>}
      <div className="up-name">{p.name}</div>
      <div className="up-ai">
        <Icon name="Sparkle" size={14} />
        <b>{p.ai}</b> azioni AI/mese
      </div>
      <div className="up-price">
        <span className="up-cur">{euro(yearly ? p.yr : p.mo)}</span>
        <span className="up-per">{yearly ? "/anno" : "/mese"}</span>
      </div>
      <div className="up-feats">
        {p.feats.map((f, i) => (
          <div key={i} className="up-feat">
            <Icon name="Check" size={15} />
            <span>{f}</span>
          </div>
        ))}
      </div>
      {p.current ? (
        <button className="up-btn ghost" disabled>
          Piano attuale
        </button>
      ) : (
        <button className={`up-btn${p.popular ? " solid" : " outline"}`} onClick={onPick}>
          Passa a {p.name}
        </button>
      )}
    </div>
  );
}

/** Pagina Upgrade: scelta del piano (mensile/annuale). */
export default function Upgrade({ onHome, onBack, notify }: Props) {
  const [yearly, setYearly] = useState(false);
  return (
    <div className="vc up">
      <div className="vc-crumb">
        <button onClick={onHome}>Home</button>
        <Icon name="Arrow" size={14} />
        <button onClick={onBack}>My Value Center</button>
        <Icon name="Arrow" size={14} />
        <span>Upgrade</span>
      </div>
      <div className="vc-body">
        <div className="up-head">
          <h1>Scegli il piano giusto per te</h1>
          <p>Più azioni AI per Faro, più lavoro che si gestisce da solo. Cambia o disdici quando vuoi.</p>
          <div className="up-toggle">
            <button className={!yearly ? "on" : ""} onClick={() => setYearly(false)}>
              Mensile
            </button>
            <button className={yearly ? "on" : ""} onClick={() => setYearly(true)}>
              Annuale
              <span className="up-save">-2 mesi</span>
            </button>
          </div>
        </div>
        <div className="up-grid">
          {PLANS.map((p) => (
            <PlanCard key={p.id} p={p} yearly={yearly} onPick={() => notify({ icon: "Sparkle", color: p.tone, title: `Upgrade a ${p.name}`, msg: "Checkout non incluso nel prototipo" })} />
          ))}
        </div>
        <div className="up-foot">
          <Icon name="Lock" size={14} />
          Pagamenti sicuri · fatturazione gestita da TeamSystem · puoi cambiare piano in qualsiasi momento.
        </div>
      </div>
    </div>
  );
}
