import Icon from "../components/Icon";
import type { View } from "../types";

interface Props {
  view: View;
  setView: (v: View) => void;
}

/** Barra superiore globale TeamSystem (scura): logo, navigazione, azienda, avatar. */
export default function TopBar({ view, setView }: Props) {
  return (
    <div className="ts-topbar">
      <button className="ts-burger" title="Menu">
        <Icon name="Menu" size={20} />
      </button>
      <div className="ts-logo">
        <div className="ts-mark">ts</div>
        <span>TeamSystem</span>
      </div>
      <div className="spacer" />
      <button className="ts-ic" title="Aiuto">
        <Icon name="Help" size={18} />
      </button>
      <button className={`ts-navbtn${view === "permessi" ? " on" : ""}`} title="Permessi di accesso" onClick={() => setView(view === "permessi" ? "board" : "permessi")}>
        <Icon name="Shield" size={16} />
        Permessi
      </button>
      <button className={`ts-navbtn${view === "value" ? " on" : ""}`} onClick={() => setView(view === "value" ? "board" : "value")}>
        <Icon name="Trend" size={16} />
        My Value Center
      </button>
      <div className="ts-company">
        <div className="ts-co-ic">
          <Icon name="Building" size={15} />
        </div>
        <b>Studio Mario Rossi</b>
        <Icon name="Chevron" size={15} />
      </div>
      <div className="ts-avatar" title="Mario Rossi">
        MR
      </div>
    </div>
  );
}
