import Icon from "../components/Icon";
import ActionCard, { type CardHandlers } from "../card/ActionCard";
import ColumnMenu from "./ColumnMenu";
import LaneToggle from "./LaneToggle";
import AutoPromoBanner from "./AutoPromoBanner";
import ConfirmAllButton from "./ConfirmAllButton";
import type { Dnd } from "../hooks/useFaroBoard";
import type { Actor, ColumnMeta, FaroAction } from "../types";

/** Controlli a livello di colonna passati dalla board. */
export interface ColumnControls {
  hideDone: Record<string, boolean>;
  toggleHideDone: (k: string) => void;
  onHideCol: () => void;
  confirmAll: () => void;
  faroTodo: number;
  autoPromo: boolean;
  onAutoYes: () => void;
  onAutoNo: () => void;
}

interface Props {
  colKey: Actor;
  meta: ColumnMeta;
  items: FaroAction[];
  dnd: Dnd;
  cardHandlers: CardHandlers;
  autoTypes: string[];
  controls: ColumnControls;
}

/** Colonna-attore (Io / Faro / Commercialista): testata, toggle e card. */
export default function Column({ colKey, meta, items, dnd, cardHandlers, autoTypes, controls }: Props) {
  const isFaro = colKey === "faro";
  const off = !!controls.hideDone[colKey];
  const doneCount = items.filter((a) => a.phase === "done").length;
  const shown = off ? items.filter((a) => a.phase !== "done") : items;

  const hintText = off && doneCount ? "Completate nascoste · riattiva il toggle per rivederle" : isFaro ? "Trascina qui per farla fare a Faro" : colKey === "comm" ? "Trascina qui per delegarla a Luca" : "Trascina qui ciò che vuoi fare tu";

  return (
    <div
      className={`col${isFaro ? " faro-col" : ""}${dnd.over === colKey ? " drop-on" : ""}`}
      style={{ ["--col" as string]: meta.color, ["--col-soft" as string]: meta.soft }}
      onDragOver={(e) => dnd.allowDrop(e, colKey)}
      onDragLeave={() => dnd.leave(colKey)}
      onDrop={(e) => dnd.onDrop(e, colKey)}
    >
      <div className="col-head">
        <div className={`av${isFaro ? " ai-circle" : ""}`} style={isFaro ? undefined : { background: meta.color }}>
          {isFaro ? <Icon name="Sparkle" size={20} /> : meta.initial}
        </div>
        <div className="ttl">
          <b>{meta.label}</b>
          <span>{meta.role}</span>
        </div>
        <div className="cnt">{shown.length}</div>
        {colKey === "comm" && <ColumnMenu onHide={controls.onHideCol} />}
      </div>

      {doneCount > 0 && <LaneToggle on={off} count={doneCount} onToggle={() => controls.toggleHideDone(colKey)} />}

      <div className="col-body">
        {isFaro && controls.autoPromo && <AutoPromoBanner onYes={controls.onAutoYes} onNo={controls.onAutoNo} />}
        {isFaro && controls.faroTodo > 0 && <ConfirmAllButton onClick={controls.confirmAll} />}

        {shown.length === 0 ? (
          <div className="col-hint">
            <div className="drop-ic">
              <Icon name="Arrow" size={18} style={{ transform: "rotate(90deg)" }} />
            </div>
            {hintText}
          </div>
        ) : (
          shown.map((a) => <ActionCard key={a.id} a={a} place={colKey} dragging={dnd.drag === a.id} autoTypes={autoTypes} handlers={cardHandlers} />)
        )}
      </div>
    </div>
  );
}
