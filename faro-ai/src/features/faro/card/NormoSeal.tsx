import Icon from "../components/Icon";
import type { NormoSeal as Seal } from "../types";

interface Props {
  normo: Seal;
  onAsk: () => void;
}

/** Sigillo normo.AI sulla card: conformità (verde) o escalation (ambra). */
export default function NormoSeal({ normo, onAsk }: Props) {
  return (
    <div className={`normo ${normo}`}>
      <Icon name="Stamp" size={13} />
      <span className="grow">{normo === "verified" ? "Verificato da normo.AI" : "normo.AI: serve il commercialista"}</span>
      <button
        className="normo-ask"
        onClick={(e) => {
          e.stopPropagation();
          onAsk();
        }}
      >
        {normo === "verified" ? "Approfondisci" : "Chiedi"}
      </button>
    </div>
  );
}
