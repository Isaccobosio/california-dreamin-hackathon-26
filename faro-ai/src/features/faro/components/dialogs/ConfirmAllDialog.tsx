import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from "@vapor/react-material";
import { faroContainedSx } from "../../theme/faroSx";

interface ConfirmAllDialogProps {
  open: boolean;
  count: number;
  onCancel: () => void;
  onConfirm: () => void;
}

/** Conferma "automatizza tutte le azioni assegnate a Faro". */
export default function ConfirmAllDialog({ open, count, onCancel, onConfirm }: ConfirmAllDialogProps) {
  return (
    <Dialog open={open} onClose={onCancel} maxWidth="xs" fullWidth>
      <DialogTitle>Sei sicuro di automatizzare queste azioni ({count})?</DialogTitle>
      <DialogContent>
        <Typography sx={{ fontSize: 14, color: "text.secondary", lineHeight: 1.6 }}>
          Faro eseguirà in autonomia le {count} azioni nella sua colonna — solleciti, invii allo SDI e riconciliazioni. Vedrai ogni passaggio nella chat.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={onCancel}>
          Annulla
        </Button>
        <Button variant="contained" sx={faroContainedSx} onClick={onConfirm}>
          Sì, automatizza
        </Button>
      </DialogActions>
    </Dialog>
  );
}
