import type { ReactNode } from "react";
import Icon from "../components/Icon";

/** Sotto-header "Faro · Centrale operativa" con eventuale azione a destra. */
export default function ContextHeader({ right }: { right?: ReactNode }) {
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
      {right}
    </div>
  );
}
