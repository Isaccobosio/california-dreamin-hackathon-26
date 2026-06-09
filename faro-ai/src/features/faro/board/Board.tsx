import { useMemo } from "react";
import Inbox from "./Inbox";
import Column from "./Column";
import { COLS } from "../data/seed";
import type { CardHandlers } from "../card/ActionCard";
import type { Dnd } from "../hooks/useFaroBoard";
import type { Actor, FaroAction } from "../types";

interface Props {
  actions: FaroAction[];
  dnd: Dnd;
  cardHandlers: CardHandlers;
  autoTypes: string[];
  hideComm: boolean;
  hideDone: Record<string, boolean>;
  toggleHideDone: (k: string) => void;
  onHideCol: () => void;
  confirmAll: () => void;
  autoPromo: boolean;
  onAutoYes: () => void;
  onAutoNo: () => void;
}

const byRank = (arr: FaroAction[]) => arr.slice().sort((x, y) => (x.urgency?.rank ?? 99) - (y.urgency?.rank ?? 99));

/** Board "chi fa cosa": tray "Da assegnare" + colonne-attore. */
export default function Board(props: Props) {
  const { actions, dnd, cardHandlers, autoTypes, hideComm } = props;

  const visible = useMemo(() => actions.filter((a) => a.phase !== "hidden"), [actions]);
  const byCol = (k: "inbox" | Actor) => byRank(visible.filter((a) => (k === "inbox" ? a.assignee === null : a.assignee === k)));
  const faroTodo = visible.filter((a) => a.assignee === "faro" && a.phase === "todo").length;

  const keys: Actor[] = hideComm ? ["me", "faro"] : ["me", "comm", "faro"];

  const controls = {
    hideDone: props.hideDone,
    toggleHideDone: props.toggleHideDone,
    onHideCol: props.onHideCol,
    confirmAll: props.confirmAll,
    faroTodo,
    autoPromo: props.autoPromo,
    onAutoYes: props.onAutoYes,
    onAutoNo: props.onAutoNo,
  };

  return (
    <div className="board">
      <Inbox items={byCol("inbox")} dnd={dnd} cardHandlers={cardHandlers} autoTypes={autoTypes} />
      <div className={`cols ${hideComm ? "two" : "three"}`}>
        {keys.map((k) => (
          <Column key={k} colKey={k} meta={COLS[k]} items={byCol(k)} dnd={dnd} cardHandlers={cardHandlers} autoTypes={autoTypes} controls={controls} />
        ))}
      </div>
    </div>
  );
}
