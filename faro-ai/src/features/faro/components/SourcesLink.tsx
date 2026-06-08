import { useState } from "react";
import { Box, Button, Typography, Link, Popover } from "@vapor/react-material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ICON, SOURCE_ICON } from "../data/icons";
import type { Source } from "../types";

interface SourcesLinkProps {
  sources?: Source[];
}

/**
 * Link "N fonti" cliccabile (spec §5): apre un popover "da dove arriva" con
 * il dettaglio concreto di ciascuna fonte e l'eventuale link "vai alla fonte".
 */
export default function SourcesLink({ sources }: SourcesLinkProps) {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  if (!sources || sources.length === 0) return null;
  const label = sources.length === 1 ? "Fonte" : `${sources.length} fonti`;

  return (
    <>
      <Button
        size="small"
        variant="text"
        startIcon={<FontAwesomeIcon icon={ICON.search} />}
        onClick={(e: React.MouseEvent<HTMLElement>) => {
          e.stopPropagation();
          setAnchor(e.currentTarget);
        }}
        sx={{ fontSize: 12, fontWeight: 700, px: 0.75, minWidth: 0 }}
      >
        {label}
      </Button>
      <Popover
        open={!!anchor}
        anchorEl={anchor}
        onClose={() => setAnchor(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
      >
        <Box sx={{ p: 1.5, width: 300, display: "flex", flexDirection: "column", gap: 1.25 }}>
          <Typography sx={{ fontSize: 11, fontWeight: 800, color: "text.secondary", textTransform: "uppercase" }}>Da dove arriva</Typography>
          {sources.map((s, i) => (
            <Box key={i} sx={{ display: "flex", gap: 1.25, alignItems: "flex-start" }}>
              <Box sx={{ width: 28, height: 28, borderRadius: 1, flex: "none", display: "grid", placeItems: "center", bgcolor: "action.hover", color: "text.secondary" }}>
                <FontAwesomeIcon icon={SOURCE_ICON[s.kind]} size="sm" />
              </Box>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography sx={{ fontSize: 13, fontWeight: 700 }}>{s.label}</Typography>
                <Typography sx={{ fontSize: 12, color: "text.secondary", lineHeight: 1.4 }}>{s.detail}</Typography>
                {s.href && (
                  <Link href={s.href} target="_blank" rel="noopener noreferrer" sx={{ fontSize: 12, fontWeight: 700, display: "inline-flex", alignItems: "center", gap: 0.5, mt: 0.25 }}>
                    Vai alla fonte <FontAwesomeIcon icon={ICON.ext} size="xs" />
                  </Link>
                )}
              </Box>
            </Box>
          ))}
        </Box>
      </Popover>
    </>
  );
}
