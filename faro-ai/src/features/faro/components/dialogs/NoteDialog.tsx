import { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box, Typography } from "@vapor/react-material";
import type { FaroAction } from "../../types";

interface NoteDialogProps {
  a: FaroAction | null;
  onCancel: () => void;
  onSend: (text: string) => void;
}

/** Thread di note tra titolare e commercialista (Luca). */
export default function NoteDialog({ a, onCancel, onSend }: NoteDialogProps) {
  const [text, setText] = useState("");
  if (!a) return null;
  const thread = a.thread ?? [];

  return (
    <Dialog open onClose={onCancel} maxWidth="xs" fullWidth>
      <DialogTitle>Note · {a.client}</DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, py: 1 }}>
          {thread.length === 0 && <Typography sx={{ fontSize: 13, color: "text.disabled", textAlign: "center", py: 2 }}>Nessuna nota. Scrivi la prima a Luca.</Typography>}
          {thread.map((m, i) => (
            <Box key={i} sx={{ display: "flex", gap: 1 }}>
              <Box sx={{ width: 30, height: 30, borderRadius: "50%", flex: "none", display: "grid", placeItems: "center", color: "#fff", fontWeight: 800, fontSize: 11, bgcolor: m.author === "me" ? "primary.main" : "success.main" }}>
                {m.author === "me" ? "MR" : "LF"}
              </Box>
              <Box>
                <Typography sx={{ fontSize: 12.5, fontWeight: 800 }}>
                  {m.name}{" "}
                  <Box component="span" sx={{ fontWeight: 400, color: "text.disabled" }}>
                    {m.time}
                  </Box>
                </Typography>
                <Typography sx={{ fontSize: 13, color: "text.secondary" }}>{m.text}</Typography>
              </Box>
            </Box>
          ))}
          <TextField placeholder="Scrivi una nota a Luca…" value={text} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setText(e.target.value)} multiline minRows={2} fullWidth />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={onCancel}>
          Chiudi
        </Button>
        <Button
          variant="contained"
          color="success"
          disabled={!text.trim()}
          onClick={() => {
            onSend(text.trim());
            setText("");
          }}
        >
          Invia nota
        </Button>
      </DialogActions>
    </Dialog>
  );
}
