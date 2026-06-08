import { Card, Chip, Button, Typography, Box } from "@vapor/react-material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { ICON } from "../data/icons";
import { CTA } from "../data/seed";
import { faroContainedSx } from "../theme/faroSx";
import SourcesLink from "./SourcesLink";
import NormoBadge from "./NormoBadge";
import type { ActionKind, ColumnKey, FaroAction, UrgencyLevel } from "../types";

/** Handler richiesti da una card per gli stati interattivi. */
export interface CardHandlers {
  runFaro: (id: string) => void;
  openDetail: (id: string) => void;
  openSettle: (id: string) => void;
  openNote: (id: string) => void;
}

/** Stile della chip di urgenza in testa alla card (sfondo tenue + testo). */
const URG_CHIP: Record<UrgencyLevel, { bgcolor: string; color: string }> = {
  r: { bgcolor: "#fdecea", color: "#c62828" },
  a: { bgcolor: "#fff4e0", color: "#b26a00" },
  g: { bgcolor: "#e7f6ec", color: "#1b7e3c" },
};

/** Tipi di azione che si "saldano" (vs. dettaglio generico) in colonna Io. */
const SETTLE_KINDS: ActionKind[] = ["sollecito", "incasso", "ricorrente", "sdi", "passiva"];

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
}

function StatusLine({ icon, color, text, spin }: StatusLineProps) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 0.9, fontSize: 12.5, fontWeight: 700, color, mt: 1 }}>
      <FontAwesomeIcon icon={icon} spin={spin} />
      <span>{text}</span>
    </Box>
  );
}

export default function ActionCard({ a, place, onDragStart, onDragEnd, dragging, handlers }: ActionCardProps) {
  const { runFaro, openDetail, openSettle, openNote } = handlers;

  const statusLine = () => {
    if (a.phase === "work") return <StatusLine icon={ICON.clock} color="var(--faro-strong)" text={a.doneMsg} spin />;
    if (a.phase === "ask") return <StatusLine icon={ICON.clock} color="var(--faro-strong)" text="In attesa della tua conferma in chat…" />;
    if (a.phase === "done") return <StatusLine icon={ICON.check} color={place === "comm" ? "success.dark" : "success.main"} text={a.doneMsg} />;
    if (a.phase === "taken" && place === "comm") return <StatusLine icon={ICON.clock} color="success.dark" text="Presa in carico da Luca" />;
    return null;
  };

  const actionButton = () => {
    if (a.phase === "taken" && place === "comm")
      return (
        <Button size="small" variant="contained" startIcon={<FontAwesomeIcon icon={ICON.history} />} onClick={() => openNote(a.id)}>
          {a.thread && a.thread.length ? `Note (${a.thread.length})` : "Aggiungi una nota"}
        </Button>
      );
    if (a.phase === "todo" && place === "me")
      return (
        <Button
          size="small"
          variant="contained"
          startIcon={SETTLE_KINDS.includes(a.kind) ? <FontAwesomeIcon icon={ICON.check} /> : undefined}
          onClick={() => (SETTLE_KINDS.includes(a.kind) ? openSettle(a.id) : openDetail(a.id))}
        >
          {SETTLE_KINDS.includes(a.kind) ? "Segna come saldata" : CTA[a.kind] || "Apri"}
        </Button>
      );
    if (a.phase === "todo" && place === "faro")
      return (
        <Button size="small" variant="contained" sx={faroContainedSx} onClick={() => runFaro(a.id)}>
          Delega a Faro
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
        if (!(e.target as HTMLElement).closest("button, a")) openDetail(a.id);
      }}
      className={dragging ? "card-dragging" : ""}
      sx={{
        p: 1.5,
        cursor: "grab",
        borderRadius: 2,
        border: "1px solid",
        borderColor: a.urgency?.level === "r" && a.phase !== "done" ? "error.light" : "divider",
        boxShadow: "0 1px 2px rgba(20,40,60,.06)",
      }}
    >
      {a.urgency && (
        <Chip size="small" label={a.urgency.text} sx={{ ...URG_CHIP[a.urgency.level], fontWeight: 700, height: 22, mb: 1.25 }} />
      )}

      <Box sx={{ display: "flex", gap: 1, alignItems: "flex-start" }}>
        <Typography sx={{ flex: 1, minWidth: 0, fontWeight: 700, fontSize: 15, lineHeight: 1.3 }}>{a.title}</Typography>
        <Typography sx={{ fontWeight: 800, fontSize: 15, whiteSpace: "nowrap" }}>{a.amount}</Typography>
      </Box>
      <Typography sx={{ fontSize: 12.5, color: "text.secondary", mt: 0.25 }}>{a.client}</Typography>

      {a.normo === "verified" && <NormoBadge onDeepen={() => openDetail(a.id)} />}
      {statusLine()}

      <Box sx={{ mt: 1.25, pt: 1, borderTop: "1px solid", borderColor: "divider", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1 }}>
        <SourcesLink sources={a.sources} />
        {actionButton()}
      </Box>
    </Card>
  );
}
