import { useState } from "react";
import { Box, Button, Typography, Breadcrumbs, Link, Paper } from "@vapor/react-material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ICON } from "../data/icons";

interface UpgradeProps {
  onHome: () => void;
  onBack: () => void;
  notify: (title: string, msg?: string) => void;
}

interface Plan {
  id: string;
  name: string;
  tone: string;
  mo: number;
  yr: number;
  ai: string;
  tag: string | null;
  current?: boolean;
  popular?: boolean;
  feats: string[];
}

const PLANS: Plan[] = [
  { id: "base", name: "Base", tone: "#566b76", mo: 9, yr: 90, ai: "300", tag: null, feats: ["300 azioni AI / mese", "Solleciti e invii allo SDI", "1 utente", "Supporto via email"] },
  { id: "pro", name: "Pro", tone: "var(--faro)", mo: 24, yr: 240, ai: "2.000", tag: "Attuale", current: true, feats: ["2.000 azioni AI / mese", "Riconciliazioni automatiche", "Conferme ricorrenti", "3 utenti + commercialista", "Supporto prioritario"] },
  { id: "business", name: "Business", tone: "#008FD6", mo: 49, yr: 490, ai: "6.000", tag: "Consigliato", popular: true, feats: ["6.000 azioni AI / mese", "Automazioni avanzate di Faro", "normo.AI illimitato", "10 utenti", "Account manager dedicato"] },
  { id: "unlimited", name: "Unlimited", tone: "#09822A", mo: 99, yr: 990, ai: "∞", tag: null, feats: ["Azioni AI illimitate", "Faro in piena autonomia", "API e integrazioni custom", "Utenti illimitati", "SLA garantito 24/7"] },
];

export default function Upgrade({ onHome, onBack, notify }: UpgradeProps) {
  const [yearly, setYearly] = useState(false);
  const euro = (n: number) => "€ " + n.toLocaleString("it-IT");

  return (
    <Box sx={{ flex: 1, overflowY: "auto", bgcolor: "background.default" }}>
      <Box sx={{ px: 3, py: 2 }}>
        <Breadcrumbs>
          <Link component="button" onClick={onHome} underline="hover">
            Home
          </Link>
          <Link component="button" onClick={onBack} underline="hover">
            My Value Center
          </Link>
          <Typography color="text.primary">Upgrade</Typography>
        </Breadcrumbs>
      </Box>
      <Box sx={{ maxWidth: 1180, mx: "auto", px: 3, pb: 5 }}>
        <Box sx={{ textAlign: "center", maxWidth: 640, mx: "auto", mb: 3 }}>
          <Typography sx={{ fontSize: 30, fontWeight: 800, letterSpacing: "-.6px" }}>Scegli il piano giusto per te</Typography>
          <Typography sx={{ fontSize: 14, color: "text.secondary", mt: 1 }}>Più azioni AI per Faro, più lavoro che si gestisce da solo. Cambia o disdici quando vuoi.</Typography>
          <Box sx={{ display: "inline-flex", gap: 0.5, mt: 2, bgcolor: "action.hover", borderRadius: 5, p: 0.5 }}>
            <Button size="small" variant={!yearly ? "contained" : "text"} onClick={() => setYearly(false)}>
              Mensile
            </Button>
            <Button size="small" variant={yearly ? "contained" : "text"} onClick={() => setYearly(true)}>
              Annuale · -2 mesi
            </Button>
          </Box>
        </Box>

        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr 1fr", md: "repeat(4, 1fr)" }, gap: 1.75, alignItems: "stretch" }}>
          {PLANS.map((p) => (
            <Paper
              key={p.id}
              variant="outlined"
              sx={{ position: "relative", display: "flex", flexDirection: "column", borderRadius: 2.25, p: 2.25, pt: p.tag ? 3.5 : 2.75, border: "1.5px solid", borderColor: p.popular ? p.tone : "divider", bgcolor: p.current ? "action.hover" : "background.paper" }}
            >
              {p.tag && (
                <Box sx={{ position: "absolute", top: -11, left: "50%", transform: "translateX(-50%)", fontSize: 10.5, fontWeight: 800, px: 1.5, py: 0.5, borderRadius: 5, bgcolor: p.tone, color: "#fff", whiteSpace: "nowrap" }}>{p.tag}</Box>
              )}
              <Typography sx={{ fontSize: 18, fontWeight: 800 }}>{p.name}</Typography>
              <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.5, mt: 1, fontSize: 12.5, color: p.tone, fontWeight: 700 }}>
                <FontAwesomeIcon icon={ICON.faro} size="sm" /> <b>{p.ai}</b> azioni AI/mese
              </Box>
              <Box sx={{ display: "flex", alignItems: "baseline", gap: 0.5, mt: 2, mb: 0.5 }}>
                <Typography sx={{ fontSize: 30, fontWeight: 800, letterSpacing: "-1px", whiteSpace: "nowrap" }}>{euro(yearly ? p.yr : p.mo)}</Typography>
                <Typography sx={{ fontSize: 13, color: "text.secondary", fontWeight: 700 }}>{yearly ? "/anno" : "/mese"}</Typography>
              </Box>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.25, my: 2, flex: 1 }}>
                {p.feats.map((f, i) => (
                  <Box key={i} sx={{ display: "flex", gap: 1.1, fontSize: 12.5, color: "text.secondary" }}>
                    <FontAwesomeIcon icon={ICON.check} color={p.tone} style={{ marginTop: 2, flex: "none" }} />
                    <span>{f}</span>
                  </Box>
                ))}
              </Box>
              {p.current ? (
                <Button fullWidth variant="outlined" disabled>
                  Piano attuale
                </Button>
              ) : (
                <Button fullWidth variant={p.popular ? "contained" : "outlined"} onClick={() => notify(`Upgrade a ${p.name}`, "Checkout non incluso nel prototipo")}>
                  Passa a {p.name}
                </Button>
              )}
            </Paper>
          ))}
        </Box>
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 1, mt: 3, fontSize: 12.5, color: "text.secondary" }}>
          <FontAwesomeIcon icon={ICON.shield} /> Pagamenti sicuri · fatturazione gestita da TeamSystem · puoi cambiare piano in qualsiasi momento.
        </Box>
      </Box>
    </Box>
  );
}
