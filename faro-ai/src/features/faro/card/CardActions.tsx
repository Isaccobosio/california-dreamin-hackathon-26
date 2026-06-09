import type { ReactNode } from "react";
import Icon from "../components/Icon";
import { CTA } from "../data/seed";
import type { ColumnKey, FaroAction } from "../types";

/** Handler richiesti dalle azioni in fondo alla card. */
export interface CardActionHandlers {
  runFaro: (id: string) => void;
  openDetail: (id: string) => void;
  openSettle: (id: string) => void;
  openNote: (id: string) => void;
}

interface Args {
  a: FaroAction;
  place: ColumnKey;
  isAuto: boolean;
  h: CardActionHandlers;
}

const SETTLE_KINDS = ["sollecito", "incasso", "ricorrente", "sdi"];

/**
 * Nodo del piede card in base a fase + colonna: lavorazione, attesa, risolto,
 * CTA "io", "Delega a Faro", presa in carico dal commercialista.
 * Restituisce null quando non c'è nessuna azione (così la card non mostra il piede).
 */
export function cardActionNode({ a, place, isAuto, h }: Args): ReactNode {
  if (a.phase === "work")
    return (
      <div className="status work">
        <span className="spin" />
        {a.doneMsg}
      </div>
    );

  if (a.phase === "ask")
    return (
      <div className="status work">
        <Icon name="Clock" size={13} />
        In attesa della tua conferma in chat…
      </div>
    );

  if (a.phase === "done")
    return (
      <div className="resolved">
        <span className={`txt ${place === "comm" ? "comm" : "done"}`}>
          <Icon name={place === "comm" ? "Building" : "CheckCircle"} size={14} />
          {a.doneMsg}
        </span>
      </div>
    );

  if (a.phase === "todo" && place === "me")
    return (
      <div className="act-btns">
        {SETTLE_KINDS.includes(a.kind) ? (
          <button className="btn blue cta-full" onClick={() => h.openSettle(a.id)}>
            <Icon name="Check" size={14} />
            Segna come saldata
          </button>
        ) : (
          <button className="btn blue cta-full" onClick={() => h.openDetail(a.id)}>
            {CTA[a.kind] || "Apri"}
            <Icon name="Arrow" size={14} />
          </button>
        )}
      </div>
    );

  if (a.phase === "todo" && place === "faro")
    return (
      <div className="act-btns">
        <button className="btn faro cta-full" onClick={() => h.runFaro(a.id)}>
          {isAuto ? "Esegui (automatico)" : "Delega a Faro"}
        </button>
      </div>
    );

  if (a.phase === "taken" && place === "comm")
    return (
      <div className="comm-track">
        <div className="cstate">
          <Icon name="Clock" size={13} />
          Presa in carico da Luca
        </div>
        <button className="btn light cta-full" onClick={() => h.openNote(a.id)}>
          <Icon name="Doc" size={13} />
          Aggiungi una nota
        </button>
      </div>
    );

  if (place === "comm")
    return (
      <div className="act-btns">
        <button className="btn light cta-full" onClick={() => h.openNote(a.id)}>
          <Icon name="Doc" size={13} />
          {a.thread && a.thread.length ? `Note (${a.thread.length})` : "Aggiungi una nota"}
        </button>
      </div>
    );

  return null;
}
