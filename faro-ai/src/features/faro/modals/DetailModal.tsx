import Icon from "../components/Icon";
import ModalShell from "./ModalShell";
import { SRC } from "../data/domain";
import type { FaroAction } from "../types";

interface Props {
  a: FaroAction | null;
  onClose: () => void;
  onExt: (label: string) => void;
}

/** Dettaglio di una card: urgenza, descrizione, catena, sigillo, "apri in…". */
export default function DetailModal({ a, onClose, onExt }: Props) {
  if (!a) return null;
  const links = (a.sources ?? []).filter((s) => s.link && s.kind !== "normo").slice(0, 1);

  return (
    <ModalShell onClose={onClose} className="detail">
      <div className="pv-head">
        <div className="modal-ic sm" style={{ background: "var(--bg-2)", color: "var(--ink-2)", boxShadow: "none" }}>
          <Icon name={a.icon} size={18} />
        </div>
        <div className="grow">
          <h3>{a.title}</h3>
          <div className="pv-sub">
            {a.client} · {a.amount}
          </div>
        </div>
        <button className="x" onClick={onClose}>
          <Icon name="X" size={17} />
        </button>
      </div>

      <div className="dt-body">
        {a.urgency && (
          <div className={`dt-line ${a.urgency.level}`}>
            <Icon name="Clock" size={14} />
            <span>{a.urgency.text}</span>
          </div>
        )}
        {a.sub && (
          <div className="dt-line">
            <Icon name="Doc" size={14} />
            <span>{a.sub}</span>
          </div>
        )}
        {a.chain && (
          <div className="dt-chain">
            <Icon name="Sparkle" size={13} />
            {a.chain}
          </div>
        )}
        {a.normo && (
          <div className={`normo ${a.normo}`} style={{ marginTop: 2 }}>
            <Icon name="Stamp" size={13} />
            <span className="grow">{a.normo === "verified" ? "Verificato da normo.AI" : "normo.AI: serve il commercialista"}</span>
          </div>
        )}
        <div className="dt-sec">Apri in</div>
        {links.map((l, i) => {
          const cfg = SRC[l.kind];
          return (
            <button key={i} className="ext-link" onClick={() => onExt(l.link!)}>
              <div className="src-ic" style={{ color: cfg.color, background: `color-mix(in srgb, ${cfg.color} 12%, #fff)` }}>
                <Icon name={cfg.icon} size={14} />
              </div>
              <span className="grow">{l.link}</span>
              <Icon name="ArrowUR" size={14} />
            </button>
          );
        })}
      </div>

      <div className="modal-foot">
        <button className="btn ghost" onClick={onClose}>
          Chiudi
        </button>
      </div>
    </ModalShell>
  );
}
