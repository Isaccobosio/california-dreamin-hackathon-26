import type { CSSProperties, ReactNode } from "react";
import Icon from "../components/Icon";
import { AI_USAGE_PCT } from "../data/domain";
import type { View } from "../types";

interface Props {
  view: View;
  setView: (v: View) => void;
  right?: ReactNode;
}

/** Header bianco "Faro · Centrale operativa" con la navigazione Faro a destra. */
export default function ContextHeader({ view, setView, right }: Props) {
  return (
    <div className="ctx-header">
      <div className="brandmark">
        <div className="lamp ai-circle">
          <Icon name="Sparkle" size={20} />
        </div>
        <div>
          <b>Faro</b>
          <span>Centrale operativa · lunedì 8 giugno</span>
        </div>
      </div>
      <div className="spacer" />

      <button className={`vc-btn${view === "board" ? " on" : ""}`} onClick={() => setView("board")}>
        <Icon name="Grid" size={16} />
        Dashboard
      </button>
      <button className={`vc-btn${view === "permessi" ? " on" : ""}`} title="Permessi di accesso" onClick={() => setView(view === "permessi" ? "board" : "permessi")}>
        <Icon name="Shield" size={16} />
        Permessi
      </button>
      <button
        className={`vc-btn meter${view === "value" ? " on" : ""}`}
        style={{ ["--fill" as string]: `${AI_USAGE_PCT}%` } as CSSProperties}
        title={`Consumi AI: ${AI_USAGE_PCT}%`}
        onClick={() => setView(view === "value" ? "board" : "value")}
      >
        <Icon name="Trend" size={16} />
        My Value Center
        <span className="vc-btn-pct">{AI_USAGE_PCT}%</span>
      </button>

      {right}
    </div>
  );
}
