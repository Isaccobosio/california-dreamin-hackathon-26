import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import { Box, Button, Avatar, Typography } from "@vapor/react-material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ICON } from "../data/icons";
import type { View } from "../types";

interface TopBarProps {
  view: View;
  setView: (v: View) => void;
}

export default function TopBar({ view, setView }: TopBarProps) {
  return (
    <AppBar position="sticky" elevation={0} sx={{ bgcolor: "background.paper", color: "text.primary", borderBottom: "1px solid", borderColor: "divider" }}>
      <Toolbar sx={{ gap: 1.5, minHeight: 64 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
          <Box sx={{ width: 34, height: 34, borderRadius: 1.5, display: "grid", placeItems: "center", background: "linear-gradient(135deg, var(--faro), var(--faro-2))", color: "#fff" }}>
            <FontAwesomeIcon icon={ICON.faro} />
          </Box>
          <Box sx={{ lineHeight: 1.1 }}>
            <Typography sx={{ fontWeight: 800, fontSize: 16 }}>Faro</Typography>
            <Typography sx={{ fontSize: 11, color: "text.secondary" }}>Centrale operativa</Typography>
          </Box>
        </Box>

        <Box sx={{ flex: 1 }} />

        <Typography sx={{ fontSize: 13, color: "text.secondary", mr: 1, display: { xs: "none", md: "block" } }}>lunedì 8 giugno</Typography>

        <Button variant={view === "permessi" ? "contained" : "outlined"} size="small" startIcon={<FontAwesomeIcon icon={ICON.shield} />} onClick={() => setView(view === "permessi" ? "board" : "permessi")}>
          Permessi
        </Button>
        <Button variant={view === "value" ? "contained" : "outlined"} size="small" startIcon={<FontAwesomeIcon icon={ICON.trend} />} onClick={() => setView(view === "value" ? "board" : "value")}>
          My Value Center
        </Button>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1, ml: 1, pl: 1.5, borderLeft: "1px solid", borderColor: "divider" }}>
          <Avatar sx={{ width: 32, height: 32, fontSize: 13, fontWeight: 700, bgcolor: "primary.main" }}>MR</Avatar>
          <Typography sx={{ fontWeight: 700, fontSize: 13, display: { xs: "none", sm: "block" } }}>Mario Rossi</Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
