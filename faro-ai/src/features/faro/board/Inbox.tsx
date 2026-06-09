import Icon from "../components/Icon";
import ActionCard, { type CardHandlers } from "../card/ActionCard";
import type { Dnd } from "../hooks/useFaroBoard";
import type { FaroAction } from "../types";

interface Props {
  items: FaroAction[];
  dnd: Dnd;
  cardHandlers: CardHandlers;
  autoTypes: string[];
}

/** Tray "Azioni rilevate da assegnare": le sole card incerte, scroll orizzontale. */
export default function Inbox({ items, dnd, cardHandlers, autoTypes }: Props) {
  return (
    <div
      className={`inbox${dnd.over === "inbox" ? " drop-on" : ""}`}
      onDragOver={(e) => dnd.allowDrop(e, "inbox")}
      onDragLeave={() => dnd.leave("inbox")}
      onDrop={(e) => dnd.onDrop(e, "inbox")}
    >
      <div className="inbox-head" title="Faro è incerto a chi darle — trascinale tu">
        <div className="ic ai-circle">
          <Icon name="Sparkle" size={17} />
        </div>
        <div>
          <b>Azioni rilevate da assegnare</b>
        </div>
        <div className="cnt">{items.length}</div>
      </div>
      {items.length === 0 ? (
        <div className="inbox-empty">🎉 Tutto assegnato! Nessuna azione in sospeso.</div>
      ) : (
        <div className="inbox-cards">
          {items.map((a) => (
            <ActionCard key={a.id} a={a} place="inbox" inboxCard dragging={dnd.drag === a.id} autoTypes={autoTypes} handlers={cardHandlers} />
          ))}
        </div>
      )}
    </div>
  );
}
