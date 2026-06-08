import { Card, Chip, Button, Typography, Box } from "@vapor/react-material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { ICON } from "../data/icons";
import { CTA } from "../data/seed";
import { faroContainedSx } from "../theme/faroSx";
import type { ActionKind, ColumnKey, FaroAction, UrgencyLevel } from "../types";

/** Handler richiesti da una card per gli stati interattivi. */
export interface CardHandlers {
  runFaro: (id: string) => void;
  openDetail: (id: string) => void;
  openSettle: (id: string) => void;
  openNote: (id: string) => void;
}

const URG: Record<UrgencyLevel, string> = { r: "error.main", a: "warning.main", g: "success.main" };

/** Tipi di azione che si "saldano" (vs. dettaglio generico) in colonna Io. */
const SETTLE_KINDS: ActionKind[] = ["sollecito", "incasso", "ricorrente", "sdi"];

interface ActionCardProps {
  a: FaroAction;
  place: ColumnKey;
  dragging: boolean;
  onDragStart: (e: React.DragEvent, id: string) => void;
  onDragEnd: () => void;
  handlers: CardHandlers;
}

interface StatusLineProps {
  icon: IconDefinition;
  color: string;
  text: string | null;
  spin?: boolean;
  inline?: boolean;
}

function StatusLine({ icon, color, text, spin, inline }: StatusLineProps) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 0.9,
        fontSize: 12,
        fontWeight: 700,
        color,
        ...(inline ? {} : { borderTop: "1px dashed", borderColor: "divider", pt: 1.1, mt: 1 }),
      }}
    >
      <FontAwesomeIcon icon={icon} spin={spin} />
      <span>{text}</span>
    </Box>
  );
}

export default function ActionCard({ a, place, onDragStart, onDragEnd, dragging, handlers }: ActionCardProps) {
  const { runFaro, openDetail, openSettle, openNote } = handlers;

  const foot = () => {
    if (a.phase === "work") return <StatusLine icon={ICON.clock} color="var(--faro-strong)" text={a.doneMsg} spin />;
    if (a.phase === "ask") return <StatusLine icon={ICON.clock} color="var(--faro-strong)" text="In attesa della tua conferma in chat…" />;
    if (a.phase === "done") return <StatusLine icon={ICON.check} color={place === "comm" ? "success.dark" : "success.main"} text={a.doneMsg} />;
    if (a.phase === "taken" && place === "comm")
      return (
        <Box sx={{ borderTop: "1px dashed", borderColor: "divider", pt: 1.2, mt: 0.5 }}>
          <StatusLine icon={ICON.clock} color="success.dark" text="Presa in carico da Luca" inline />
          <Button fullWidth size="small" variant="outlined" sx={{ mt: 1 }} startIcon={<FontAwesomeIcon icon={ICON.history} />} onClick={() => openNote(a.id)}>
            {a.thread && a.thread.length ? `Note (${a.thread.length})` : "Aggiungi nota"}
          </Button>
        </Box>
      );
    if (a.phase === "todo" && place === "me")
      return (
        <Button
          fullWidth
          size="small"
          variant="contained"
          sx={{ mt: 1 }}
          onClick={() => (SETTLE_KINDS.includes(a.kind) ? openSettle(a.id) : openDetail(a.id))}
        >
          {SETTLE_KINDS.includes(a.kind) ? "Segna come saldata" : CTA[a.kind] || "Apri"}
        </Button>
      );
    if (a.phase === "todo" && place === "faro")
      return (
        <Button fullWidth size="small" variant="contained" sx={{ ...faroContainedSx, mt: 1 }} onClick={() => runFaro(a.id)}>
          Lascia fare a Faro
        </Button>
      );
    return null;
  };

  return (
    <Card
      draggable
      onDragStart={(e: React.DragEvent) => onDragStart(e, a.id)}
      onDragEnd={onDragEnd}
      onClick={(e: React.MouseEvent) => {
        if (!(e.target as HTMLElement).closest("button")) openDetail(a.id);
      }}
      className={dragging ? "card-dragging" : ""}
      sx={{
        p: 1.5,
        cursor: "grab",
        borderRadius: 1.5,
        border: "1px solid",
        borderColor: "divider",
        boxShadow: "0 1px 2px rgba(20,40,60,.06)",
        ...(a.urgency && a.urgency.level === "r" && a.phase !== "done" ? { borderColor: "error.light" } : {}),
      }}
    >
      <Box sx={{ display: "flex", gap: 1.25, alignItems: "flex-start" }}>
        <Box sx={{ width: 30, height: 30, borderRadius: 1, flex: "none", display: "grid", placeItems: "center", bgcolor: "action.hover", color: "text.secondary" }}>
          <FontAwesomeIcon icon={ICON[a.kind]} />
        </Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography sx={{ fontWeight: 700, fontSize: 14, lineHeight: 1.25 }}>{a.title}</Typography>
          {a.urgency && (
            <Typography sx={{ fontSize: 12, fontWeight: 700, mt: 0.4, color: URG[a.urgency.level] }}>{a.urgency.text}</Typography>
          )}
        </Box>
        <Typography sx={{ fontWeight: 800, fontSize: 13, whiteSpace: "nowrap" }}>{a.amount}</Typography>
      </Box>

      {!a.bare && (
        <Box sx={{ mt: 1 }}>
          <Chip size="small" variant="outlined" label={a.tag[0]} />
        </Box>
      )}
      {foot()}
    </Card>
  );
}
