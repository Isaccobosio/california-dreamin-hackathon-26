import { Box, Button, Typography, Breadcrumbs, Link, Paper } from "@vapor/react-material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { ICON } from "../data/icons";
import { faroContainedSx } from "../theme/faroSx";

interface ValueCenterProps {
  onHome: () => void;
  onUpgrade: () => void;
}

interface HeroProps {
  color: string;
  icon: IconDefinition;
  badge: string;
  value: string;
  label: string;
  bar?: number;
}

/** Hero "outline": contorno colorato, nessun riempimento. */
function Hero({ color, icon, badge, value, label, bar }: HeroProps) {
  return (
    <Paper variant="outlined" sx={{ p: 2.25, borderRadius: 2.25, border: "1.5px solid", borderColor: color, display: "flex", flexDirection: "column", gap: 0.5, minHeight: 150 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1.75 }}>
        <Box sx={{ width: 38, height: 38, borderRadius: 1.5, display: "grid", placeItems: "center", bgcolor: color, color: "#fff" }}>
          <FontAwesomeIcon icon={icon} />
        </Box>
        <Box sx={{ fontSize: 12, fontWeight: 800, color, bgcolor: `${color}1f`, px: 1.1, py: 0.4, borderRadius: 5 }}>{badge}</Box>
      </Box>
      <Typography sx={{ fontSize: 34, fontWeight: 800, letterSpacing: "-1px", mt: "auto", color: "text.primary" }}>{value}</Typography>
      <Typography sx={{ fontSize: 13.5, fontWeight: 700, color }}>{label}</Typography>
      {bar != null && (
        <Box sx={{ height: 6, borderRadius: 5, bgcolor: `${color}2e`, mt: 1, overflow: "hidden" }}>
          <Box sx={{ height: "100%", width: `${bar}%`, bgcolor: color, borderRadius: 5 }} />
        </Box>
      )}
    </Paper>
  );
}

const BREAKDOWN: Array<[string, number, number, string]> = [
  ["Solleciti inviati", 420, 33, "var(--faro)"],
  ["Fatture allo SDI", 380, 30, "#15293e"],
  ["Riconciliazioni bancarie", 280, 22, "#008FD6"],
  ["Conferme ricorrenti", 120, 9, "#09822A"],
  ["Altre azioni", 80, 6, "#98AAB3"],
];

const SUMMARY: Array<[IconDefinition, string, string]> = [
  [ICON.clock, "Ore risparmiate", "12h"],
  [ICON.faro, "Avviate da Faro", "68%"],
  [ICON.euro, "ROI stimato", "€ 2.450"],
];

export default function ValueCenter({ onHome, onUpgrade }: ValueCenterProps) {
  return (
    <Box sx={{ flex: 1, overflowY: "auto", bgcolor: "background.default" }}>
      <Box sx={{ px: 3, py: 2 }}>
        <Breadcrumbs>
          <Link component="button" onClick={onHome} underline="hover">
            Home
          </Link>
          <Typography color="text.primary">My Value Center</Typography>
        </Breadcrumbs>
      </Box>
      <Box sx={{ maxWidth: 1180, mx: "auto", px: 3, pb: 5 }}>
        <Typography sx={{ fontSize: 30, fontWeight: 800, letterSpacing: "-.6px" }}>My Value Center</Typography>
        <Typography sx={{ fontSize: 14, color: "text.secondary", mt: 0.75, mb: 3 }}>Il valore che Faro ha generato per il tuo studio questo mese</Typography>

        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr 1fr", md: "repeat(4, 1fr)" }, gap: 2, mb: 3 }}>
          <Hero color="#008FD6" icon={ICON.clock} badge="+18%" value="12h" label="Tempo risparmiato" />
          <Hero color="var(--faro)" icon={ICON.faro} badge="+25%" value="847" label="Task automatizzati" />
          <Hero color="#E58A0E" icon={ICON.faro} badge="Piano Pro" value="64%" label="Consumi AI" bar={64} />
          <Hero color="#09822A" icon={ICON.trend} badge="+42%" value="€ 2.450" label="ROI stimato" />
        </Box>

        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1.5fr 1fr" }, gap: 2, alignItems: "start" }}>
          <Paper variant="outlined" sx={{ p: 2.25, borderRadius: 2.25 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, mb: 2 }}>
              <Box sx={{ width: 34, height: 34, borderRadius: 1.25, display: "grid", placeItems: "center", bgcolor: "var(--faro-soft)", color: "var(--faro-strong)" }}>
                <FontAwesomeIcon icon={ICON.faro} />
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography sx={{ fontWeight: 800, fontSize: 15 }}>Consumi AI</Typography>
                <Typography sx={{ fontSize: 12, color: "text.secondary" }}>Azioni eseguite da Faro</Typography>
              </Box>
            </Box>
            <Box sx={{ bgcolor: "action.hover", borderRadius: 1.5, p: 1.75, mb: 2 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", mb: 1 }}>
                <Typography>
                  <b style={{ fontSize: 26 }}>1.280</b> <span style={{ color: "#566b76" }}>/ 2.000 azioni</span>
                </Typography>
                <Typography sx={{ fontSize: 18, fontWeight: 800, color: "var(--faro-strong)" }}>64%</Typography>
              </Box>
              <Box sx={{ height: 11, borderRadius: 5, bgcolor: "#e0e7eb", overflow: "hidden" }}>
                <Box sx={{ height: "100%", width: "64%", background: "linear-gradient(90deg, var(--faro), var(--faro-2))" }} />
              </Box>
              <Typography sx={{ fontSize: 12, color: "text.secondary", mt: 1.25 }}>Si rinnova il 1° luglio · 720 azioni residue</Typography>
            </Box>
            {BREAKDOWN.map(([label, n, pct, color]) => (
              <Box key={label} sx={{ mb: 1.5 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, mb: 0.75 }}>
                  <span style={{ whiteSpace: "nowrap" }}>{label}</span>
                  <b>{n}</b>
                </Box>
                <Box sx={{ height: 8, borderRadius: 5, bgcolor: "#e8edf0", overflow: "hidden" }}>
                  <Box sx={{ height: "100%", width: `${pct}%`, bgcolor: color, borderRadius: 5 }} />
                </Box>
              </Box>
            ))}
            <Button variant="contained" sx={{ ...faroContainedSx, mt: 1 }} endIcon={<FontAwesomeIcon icon={ICON.ext} />} onClick={onUpgrade}>
              Effettua upgrade
            </Button>
          </Paper>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Paper variant="outlined" sx={{ p: 2.25, borderRadius: 2.25 }}>
              <Typography sx={{ fontWeight: 800, fontSize: 15, mb: 2 }}>Andamento consumi · 6 mesi</Typography>
              <Box sx={{ display: "flex", alignItems: "flex-end", gap: 1, height: 120 }}>
                {[38, 52, 47, 61, 70, 86].map((h, i) => (
                  <Box key={i} sx={{ flex: 1, height: `${h}%`, borderRadius: "6px 6px 0 0", bgcolor: i === 5 ? "primary.main" : "primary.light" }} />
                ))}
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
                {["Gen", "Feb", "Mar", "Apr", "Mag", "Giu"].map((m, i) => (
                  <Typography key={m} sx={{ flex: 1, textAlign: "center", fontSize: 11, fontWeight: 700, color: i === 5 ? "primary.main" : "text.disabled" }}>
                    {m}
                  </Typography>
                ))}
              </Box>
            </Paper>
            <Paper variant="outlined" sx={{ borderRadius: 2.25, px: 2, py: 0.5 }}>
              {SUMMARY.map(([ic, l, v], i) => (
                <Box key={i} sx={{ display: "flex", alignItems: "center", gap: 1.25, py: 1.5, borderBottom: i < 2 ? "1px solid" : "none", borderColor: "divider" }}>
                  <FontAwesomeIcon icon={ic} color="#566b76" />
                  <Typography sx={{ flex: 1, fontSize: 13.5, fontWeight: 600 }}>{l}</Typography>
                  <Typography sx={{ fontSize: 15, fontWeight: 800 }}>{v}</Typography>
                </Box>
              ))}
            </Paper>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
