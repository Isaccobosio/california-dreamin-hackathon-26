import { Box, Button, Typography } from "@vapor/react-material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ICON } from "../data/icons";

interface NormoBadgeProps {
  onDeepen?: () => void;
}

/** Sigillo di conformità normo.AI (verde) con azione "Approfondisci". */
export default function NormoBadge({ onDeepen }: NormoBadgeProps) {
  return (
    <Box sx={{ mt: 1, display: "flex", alignItems: "center", gap: 1, bgcolor: "#e7f6ec", borderRadius: 1, px: 1.25, py: 0.9 }}>
      <FontAwesomeIcon icon={ICON.stamp} color="#1b7e3c" />
      <Typography sx={{ flex: 1, fontSize: 12.5, fontWeight: 700, color: "#1b7e3c" }}>Verificato da normo.AI</Typography>
      <Button
        size="small"
        variant="outlined"
        color="success"
        sx={{ fontSize: 11.5, py: 0.2 }}
        onClick={(e: React.MouseEvent) => {
          e.stopPropagation();
          onDeepen?.();
        }}
      >
        Approfondisci
      </Button>
    </Box>
  );
}
