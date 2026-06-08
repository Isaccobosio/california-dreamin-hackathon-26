import { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Select, MenuItem, Box } from "@vapor/react-material";
import type { FaroAction } from "../../types";

interface SettleDialogProps {
  a: FaroAction | null;
  onCancel: () => void;
  onConfirm: (result: { date: string; conto: string }) => void;
}

const CONTI = ["Banca Intesa Sanpaolo", "Banca Mediolanum", "UniCredit", "Cassa contanti", "PayPal Business"];

const fmt = (d: string) => {
  const p = d.split("-");
  return p.length === 3 ? `${p[2]}/${p[1]}/${p[0]}` : d;
};

/** Segna come saldata: data + conto di saldo. */
export default function SettleDialog({ a, onCancel, onConfirm }: SettleDialogProps) {
  const [date, setDate] = useState("2026-06-08");
  const [conto, setConto] = useState(CONTI[0]);
  if (!a) return null;

  return (
    <Dialog open onClose={onCancel} maxWidth="xs" fullWidth>
      <DialogTitle>Segna come saldata · {a.client}</DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
          <TextField label="Data di saldo" type="date" value={date} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDate(e.target.value)} InputLabelProps={{ shrink: true }} fullWidth />
          <Select label="Conto di saldo" value={conto} onChange={(e) => setConto(e.target.value as string)} fullWidth>
            {CONTI.map((c) => (
              <MenuItem key={c} value={c}>
                {c}
              </MenuItem>
            ))}
          </Select>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={onCancel}>
          Annulla
        </Button>
        <Button variant="contained" onClick={() => onConfirm({ date: fmt(date), conto })}>
          Conferma saldo
        </Button>
      </DialogActions>
    </Dialog>
  );
}
