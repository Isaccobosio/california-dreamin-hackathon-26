import { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box, Typography } from "@vapor/react-material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ICON } from "../../data/icons";
import { faroContainedSx, faroOutlinedSx } from "../../theme/faroSx";
import type { FaroAction } from "../../types";

interface Recipient {
  name: string;
  email: string;
}

interface EmailDialogProps {
  a: FaroAction | null;
  onCancel: () => void;
  onConfirm: () => void;
}

/** Anteprima del sollecito (email) editabile prima dell'invio. */
export default function EmailDialog({ a, onCancel, onConfirm }: EmailDialogProps) {
  const num = a ? a.sub.replace("Fattura ", "") : "";
  const [recips, setRecips] = useState<Recipient[]>([{ name: a ? a.client : "", email: "amministrazione@cliente.it" }]);
  const [subject, setSubject] = useState(`Sollecito di pagamento — Fattura ${num}`);
  const [body, setBody] = useState(
    a ? `Gentile ${a.client},\nLe ricordiamo che la fattura di ${a.amount} risulta ${a.urgency.text}. La invitiamo cordialmente a procedere con il pagamento.\n\nCordiali saluti,\nMario Rossi` : "",
  );
  if (!a) return null;

  const setR = (i: number, k: keyof Recipient, v: string) => setRecips((rs) => rs.map((r, j) => (j === i ? { ...r, [k]: v } : r)));

  return (
    <Dialog open onClose={onCancel} maxWidth="sm" fullWidth>
      <DialogTitle>Anteprima sollecito · {a.client}</DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
          <Box>
            <Typography sx={{ fontSize: 12, fontWeight: 700, mb: 0.75, color: "text.secondary" }}>DESTINATARI</Typography>
            {recips.map((r, i) => (
              <Box key={i} sx={{ display: "flex", gap: 1, mb: 1 }}>
                <TextField size="small" placeholder="Nome" value={r.name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setR(i, "name", e.target.value)} sx={{ flex: "0 0 36%" }} />
                <TextField size="small" placeholder="email@dominio.it" value={r.email} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setR(i, "email", e.target.value)} sx={{ flex: 1 }} />
                {recips.length > 1 && (
                  <Button size="small" variant="outlined" onClick={() => setRecips((rs) => rs.filter((_, j) => j !== i))}>
                    ✕
                  </Button>
                )}
              </Box>
            ))}
            <Button size="small" variant="outlined" sx={faroOutlinedSx} onClick={() => setRecips((rs) => [...rs, { name: "", email: "" }])}>
              + Aggiungi destinatario
            </Button>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, fontSize: 13, fontWeight: 700, color: "text.secondary" }}>
            <FontAwesomeIcon icon={ICON.cal} /> Fattura {num} · {a.fdate}
          </Box>
          <TextField label="Oggetto" value={subject} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSubject(e.target.value)} fullWidth />
          <TextField label="Messaggio" value={body} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBody(e.target.value)} multiline minRows={5} fullWidth />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={onCancel}>
          Annulla
        </Button>
        <Button variant="contained" sx={faroContainedSx} onClick={onConfirm}>
          Conferma e invia
        </Button>
      </DialogActions>
    </Dialog>
  );
}
