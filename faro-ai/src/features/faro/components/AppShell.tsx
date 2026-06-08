import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import { Box, Button, Avatar, Typography, IconButton } from "@vapor/react-material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { ICON } from "../data/icons";
import type { View } from "../types";

const NAVY = "#0d2440";
const NAVY_RAIL = "#0a1c33";

interface AppShellProps {
  view: View;
  setView: (v: View) => void;
  children: React.ReactNode;
}

/** Pulsante pill bianco-su-navy della topbar. */
function TopButton({ icon, label, active, onClick }: { icon: IconDefinition; label: string; active: boolean; onClick: () => void }) {
  return (
    <Button
      size="small"
      startIcon={<FontAwesomeIcon icon={icon} />}
      onClick={onClick}
      sx={{
        color: "#fff",
        borderRadius: 5,
        border: "1px solid",
        borderColor: active ? "#fff" : "rgba(255,255,255,.35)",
        bgcolor: active ? "rgba(255,255,255,.16)" : "transparent",
        "&:hover": { bgcolor: "rgba(255,255,255,.12)", borderColor: "#fff" },
      }}
    >
      {label}
    </Button>
  );
}

/** Icona del rail laterale. */
function RailIcon({ icon, active, onClick }: { icon: IconDefinition; active: boolean; onClick: () => void }) {
  return (
    <IconButton
      onClick={onClick}
      sx={{
        width: 40,
        height: 40,
        borderRadius: 1.5,
        color: active ? "#fff" : "rgba(255,255,255,.6)",
        bgcolor: active ? "rgba(255,255,255,.14)" : "transparent",
        "&:hover": { bgcolor: "rgba(255,255,255,.1)", color: "#fff" },
      }}
    >
      <FontAwesomeIcon icon={icon} />
    </IconButton>
  );
}

/**
 * Cornice applicativa TeamSystem: topbar scura, rail laterale e sotto-header
 * "Faro · Centrale operativa". I contenuti (board, chat, pagine) sono i figli.
 */
export default function AppShell({ view, setView, children }: AppShellProps) {
  return (
    <Box sx={{ height: "100vh", display: "flex", flexDirection: "column", bgcolor: "background.default" }}>
      <AppBar position="static" elevation={0} sx={{ bgcolor: NAVY, color: "#fff" }}>
        <Toolbar sx={{ gap: 1.5, minHeight: 60 }}>
          <IconButton sx={{ color: "#fff" }}>
            <FontAwesomeIcon icon={ICON.menu} />
          </IconButton>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box sx={{ width: 30, height: 30, borderRadius: 1, display: "grid", placeItems: "center", bgcolor: "#fff", color: NAVY, fontWeight: 900, fontSize: 15 }}>ts</Box>
            <Typography sx={{ fontWeight: 800, fontSize: 17, color: "#fff" }}>TeamSystem</Typography>
          </Box>

          <Box sx={{ flex: 1 }} />

          <IconButton sx={{ color: "#fff" }}>
            <FontAwesomeIcon icon={ICON.help} />
          </IconButton>
          <TopButton icon={ICON.shield} label="Permessi" active={view === "permessi"} onClick={() => setView(view === "permessi" ? "board" : "permessi")} />
          <TopButton icon={ICON.trend} label="My Value Center" active={view === "value"} onClick={() => setView(view === "value" ? "board" : "value")} />

          <Button
            size="small"
            startIcon={<FontAwesomeIcon icon={ICON.panel} />}
            endIcon={<FontAwesomeIcon icon={ICON.chevron} />}
            sx={{ color: "#fff", borderRadius: 5, border: "1px solid rgba(255,255,255,.35)", "&:hover": { bgcolor: "rgba(255,255,255,.12)" } }}
          >
            Studio Mario Rossi
          </Button>
          <Avatar sx={{ width: 34, height: 34, fontSize: 13, fontWeight: 800, bgcolor: "#E8590C" }}>MR</Avatar>
        </Toolbar>
      </AppBar>

      <Box sx={{ flex: 1, display: "flex", minHeight: 0 }}>
        {/* Rail laterale */}
        <Box sx={{ width: 56, flex: "none", bgcolor: NAVY_RAIL, display: "flex", flexDirection: "column", alignItems: "center", gap: 1, pt: 1.5 }}>
          <RailIcon icon={ICON.faro} active={view === "board"} onClick={() => setView("board")} />
          <RailIcon icon={ICON.sdi} active={false} onClick={() => setView("board")} />
          <RailIcon icon={ICON.trend} active={view === "value"} onClick={() => setView("value")} />
        </Box>

        {/* Colonna principale */}
        <Box sx={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", minHeight: 0 }}>
          {/* Sotto-header Faro */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, px: 3, py: 1.5, bgcolor: "background.paper", borderBottom: "1px solid", borderColor: "divider" }}>
            <Box sx={{ width: 40, height: 40, borderRadius: 1.5, display: "grid", placeItems: "center", bgcolor: NAVY, color: "#fff" }}>
              <FontAwesomeIcon icon={ICON.faro} />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography sx={{ fontWeight: 800, fontSize: 18, lineHeight: 1.1 }}>Faro</Typography>
              <Typography sx={{ fontSize: 12.5, color: "text.secondary" }}>Centrale operativa · lunedì 8 giugno</Typography>
            </Box>
          </Box>

          <Box sx={{ flex: 1, display: "flex", minHeight: 0 }}>{children}</Box>
        </Box>
      </Box>
    </Box>
  );
}
