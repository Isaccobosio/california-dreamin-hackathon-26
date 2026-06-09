import SourceButton from "./SourceButton";
import NormoSeal from "./NormoSeal";
import { cardActionNode, type CardActionHandlers } from "./CardActions";
import type { ColumnKey, FaroAction } from "../types";

/** Handler completi richiesti da una card. */
export interface CardHandlers extends CardActionHandlers {
  onDragStart: (e: React.DragEvent, id: string) => void;
  onDragEnd: () => void;
  onSource: (a: FaroAction, rect: DOMRect) => void;
  askNormo: (id: string) => void;
}

interface Props {
  a: FaroAction;
  place: ColumnKey;
  inboxCard?: boolean;
  dragging: boolean;
  autoTypes: string[];
  handlers: CardHandlers;
}

/** Card-azione: riga badge+fonte, titolo+importo, sigillo normo, azione. */
export default function ActionCard({ a, place, inboxCard, dragging, autoTypes, handlers }: Props) {
  const isAuto = autoTypes.includes(a.kind);
  const cls = ["card", inboxCard ? "inbox-card" : "", dragging ? "dragging" : ""].filter(Boolean).join(" ");
  const foot = a.bare ? null : cardActionNode({ a, place, isAuto, h: handlers });

  return (
    <div
      className={cls}
      draggable
      onDragStart={(e) => handlers.onDragStart(e, a.id)}
      onDragEnd={handlers.onDragEnd}
      onClick={(e) => {
        if ((e.target as HTMLElement).closest("button, input, textarea, a, select")) return;
        handlers.openDetail(a.id);
      }}
    >
      <div className="card-pad">
        <div className="card-top">
          <div className="badges">
            {a.urgency ? (
              <span className={`badge ${a.urgency.level}`}>{a.urgency.text}</span>
            ) : a.tag ? (
              <span className={`badge ${a.tag[1]}`}>{a.tag[0]}</span>
            ) : null}
            {isAuto && <span className="badge f">✦ AUTOMATICO</span>}
          </div>
          <SourceButton sources={a.sources} onOpen={(rect) => handlers.onSource(a, rect)} />
        </div>

        <div className="card-row">
          <b className="card-title">{a.title}</b>
          <div className="amt">{a.amount}</div>
        </div>

        {a.normo && !a.bare && <NormoSeal normo={a.normo} onAsk={() => handlers.askNormo(a.id)} />}
      </div>

      {foot && (
        <div className="card-foot">
          <div className="foot-act">{foot}</div>
        </div>
      )}
    </div>
  );
}
