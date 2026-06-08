import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from "@vapor/react-material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ICON } from "../../data/icons";
import type { FaroAction } from "../../types";

interface DetailDialogProps {
  a: FaroAction | null;
  onClose: () => void;
  onExt: (label: string) => void;
}

/** Dettaglio card con link a fonte esterna (fuori dalla dashboard). */
export default function DetailDialog({ a, onClose, onExt }: DetailDialogProps) {
  if (!a) return null;
  return (
    <Dialog open onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>{a.title}</DialogTitle>
      <DialogContent>
        <Typography sx={{ fontSize: 13, color: "text.secondary", mb: 0.5 }}>
          {a.client} · {a.amount}
        </Typography>
        {a.urgency && <Typography sx={{ fontSize: 13, fontWeight: 700, mb: 1.5, color: "text.primary" }}>{a.urgency.text}</Typography>}
        <Typography sx={{ fontSize: 11, fontWeight: 800, color: "text.secondary", mb: 1 }}>APRI IN</Typography>
        <Button fullWidth variant="outlined" startIcon={<FontAwesomeIcon icon={ICON.ext} />} onClick={() => onExt("Apri ricevuta")}>
          Apri ricevuta
        </Button>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={onClose}>
          Chiudi
        </Button>
      </DialogActions>
    </Dialog>
  );
}
