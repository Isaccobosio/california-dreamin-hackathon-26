import { Box, Paper, Typography, Tooltip } from "@vapor/react-material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ActionCard, { type CardHandlers } from "./ActionCard";
import Column from "./Column";
import { ICON } from "../data/icons";
import { COLS } from "../data/seed";
import type { Actor, FaroAction } from "../types";
import type { Dnd } from "../hooks/useFaroBoard";

/** Handler della board: quelli della card + la conferma in blocco di Faro. */
export interface BoardHandlers extends CardHandlers {
  confirmAll: () => void;
}

interface BoardProps {
  actions: FaroAction[];
  hideComm: boolean;
  setHideComm: (v: boolean) => void;
  dnd: Dnd;
  handlers: BoardHandlers;
  hideDone: Record<string, boolean>;
  toggleHideDone: (key: string) => void;
}

export default function Board({ actions, hideComm, setHideComm, dnd, handlers, hideDone, toggleHideDone }: BoardProps) {
  const { drag, over, onDragStart, onDragEnd, allowDrop, leave, onDrop } = dnd;
  const inbox = actions.filter((a) => a.assignee == null);
  const colKeys: Actor[] = hideComm ? ["me", "faro"] : ["me", "comm", "faro"];

  return (
    <Box sx={{ flex: 1, minWidth: 0, p: 2.5, display: "flex", flexDirection: "column", gap: 1.75, overflow: "hidden" }}>
      {/* Inbox "Da assegnare" */}
      <Paper
        variant="outlined"
        className={over === "inbox" ? "drop-active" : ""}
        onDragOver={(e: React.DragEvent) => allowDrop(e, "inbox")}
        onDragLeave={() => leave("inbox")}
        onDrop={(e: React.DragEvent) => onDrop(e, "inbox")}
        sx={{ p: 1.75, borderRadius: 2 }}
      >
        <Tooltip title="Faro è incerto a chi darle — trascinale tu" arrow placement="right">
          <Box sx={{ display: "inline-flex", alignItems: "center", gap: 1.25, mb: 1.25 }}>
            <Box sx={{ width: 28, height: 28, borderRadius: 1, display: "grid", placeItems: "center", bgcolor: "var(--faro-soft)", color: "var(--faro-strong)" }}>
              <FontAwesomeIcon icon={ICON.faro} size="sm" />
            </Box>
            <Typography sx={{ fontWeight: 800, fontSize: 14 }}>Azioni rilevate da assegnare</Typography>
            <Box sx={{ ml: 0.5, px: 1, py: 0.1, borderRadius: 5, bgcolor: "text.primary", color: "background.paper", fontSize: 12, fontWeight: 800 }}>{inbox.length}</Box>
          </Box>
        </Tooltip>
        {inbox.length === 0 ? (
          <Typography sx={{ fontSize: 13, color: "text.secondary", fontWeight: 600, py: 1 }}>🎉 Tutto assegnato! Nessuna azione in sospeso.</Typography>
        ) : (
          <Box className="inbox-scroll">
            {inbox.map((a) => (
              <Box key={a.id} sx={{ width: 256, flex: "none" }}>
                <ActionCard a={a} place="inbox" dragging={drag === a.id} onDragStart={onDragStart} onDragEnd={onDragEnd} handlers={handlers} />
              </Box>
            ))}
          </Box>
        )}
      </Paper>

      {/* Colonne-attore */}
      <Box sx={{ flex: 1, minHeight: 0, display: "grid", gridTemplateColumns: `repeat(${colKeys.length}, 1fr)`, gap: 1.75 }}>
        {colKeys.map((k) => (
          <Column
            key={k}
            meta={COLS[k]}
            items={actions.filter((a) => a.assignee === k)}
            dnd={dnd}
            handlers={handlers}
            hideDone={!!hideDone[k]}
            toggleHideDone={() => toggleHideDone(k)}
            onHideCol={k === "comm" ? () => setHideComm(true) : null}
          />
        ))}
      </Box>
    </Box>
  );
}
