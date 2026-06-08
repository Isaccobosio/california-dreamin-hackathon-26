import { useState } from "react";
import { Paper, Box, Typography, Avatar, Button, IconButton, Menu, MenuItem } from "@vapor/react-material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis, faEye } from "@fortawesome/pro-solid-svg-icons";
import ActionCard from "./ActionCard";
import { faroContainedSx } from "../theme/faroSx";
import type { BoardHandlers } from "./Board";
import type { ColumnMeta, FaroAction } from "../types";
import type { Dnd } from "../hooks/useFaroBoard";

interface ColumnProps {
  meta: ColumnMeta;
  items: FaroAction[];
  dnd: Dnd;
  handlers: BoardHandlers;
  hideDone: boolean;
  toggleHideDone: () => void;
  onHideCol: (() => void) | null;
}

const emptyHint = (key: string) =>
  key === "faro"
    ? "Trascina qui per farla fare a Faro"
    : key === "comm"
      ? "Trascina qui per delegarla a Luca"
      : "Trascina qui ciò che vuoi fare tu";

export default function Column({ meta, items, dnd, handlers, hideDone, toggleHideDone, onHideCol }: ColumnProps) {
  const { drag, over, onDragStart, onDragEnd, allowDrop, leave, onDrop } = dnd;
  const [menuEl, setMenuEl] = useState<HTMLElement | null>(null);
  const doneCount = items.filter((a) => a.phase === "done").length;
  const shown = hideDone ? items.filter((a) => a.phase !== "done") : items;

  return (
    <Paper
      variant="outlined"
      className={over === meta.key ? "drop-active" : ""}
      onDragOver={(e: React.DragEvent) => allowDrop(e, meta.key)}
      onDragLeave={() => leave(meta.key)}
      onDrop={(e: React.DragEvent) => onDrop(e, meta.key)}
      sx={{ borderRadius: 2, display: "flex", flexDirection: "column", minHeight: 0, bgcolor: "action.hover" }}
    >
      <Box sx={{ p: 1.5, display: "flex", alignItems: "center", gap: 1.25, borderBottom: "1px solid", borderColor: "divider" }}>
        <Avatar sx={{ width: 36, height: 36, borderRadius: 1.25, fontSize: 13, fontWeight: 800, bgcolor: meta.color }}>{meta.initial}</Avatar>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography sx={{ fontWeight: 800, fontSize: 14, whiteSpace: "nowrap" }}>{meta.label}</Typography>
          <Typography sx={{ fontSize: 11, color: "text.secondary", whiteSpace: "nowrap" }}>{meta.role}</Typography>
        </Box>
        <Box sx={{ px: 1, borderRadius: 5, border: "1px solid", borderColor: "divider", bgcolor: "background.paper", fontSize: 12, fontWeight: 800 }}>{shown.length}</Box>
        {onHideCol && (
          <>
            <IconButton size="small" onClick={(e: React.MouseEvent<HTMLElement>) => setMenuEl(e.currentTarget)}>
              <FontAwesomeIcon icon={faEllipsis} />
            </IconButton>
            <Menu anchorEl={menuEl} open={!!menuEl} onClose={() => setMenuEl(null)}>
              <MenuItem
                onClick={() => {
                  setMenuEl(null);
                  onHideCol();
                }}
              >
                <FontAwesomeIcon icon={faEye} style={{ marginRight: 8 }} /> Non visualizzare questa colonna
              </MenuItem>
            </Menu>
          </>
        )}
      </Box>

      {doneCount > 0 && (
        <Box sx={{ px: 1.5, pt: 1 }}>
          <Button size="small" variant="text" onClick={toggleHideDone} sx={{ fontSize: 12 }}>
            {hideDone ? "Mostra" : "Nascondi"} azioni completate ({doneCount})
          </Button>
        </Box>
      )}

      <Box className="col-body" sx={{ flex: 1, overflowY: "auto", p: 1.5, display: "flex", flexDirection: "column", gap: 1.25 }}>
        {meta.key === "faro" && items.some((a) => a.phase === "todo") && (
          <Button variant="contained" onClick={handlers.confirmAll} sx={{ ...faroContainedSx, position: "sticky", top: 0, zIndex: 2 }}>
            Conferma tutte le azioni
          </Button>
        )}
        {shown.length === 0 ? (
          <Typography sx={{ m: "auto", textAlign: "center", color: "text.disabled", fontSize: 12, fontWeight: 600, py: 3 }}>{emptyHint(meta.key)}</Typography>
        ) : (
          shown.map((a) => (
            <ActionCard key={a.id} a={a} place={meta.key} dragging={drag === a.id} onDragStart={onDragStart} onDragEnd={onDragEnd} handlers={handlers} />
          ))
        )}
      </Box>
    </Paper>
  );
}
