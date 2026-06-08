import { useEffect, useRef, useState } from "react";
import { Box, Drawer, Typography, IconButton, TextField, Button } from "@vapor/react-material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faPaperPlane } from "@fortawesome/pro-solid-svg-icons";
import { ICON } from "../data/icons";
import { faroOutlinedSx } from "../theme/faroSx";
import type { ChatMessage } from "../types";
import type { Dnd } from "../hooks/useFaroBoard";

interface FaroChatProps {
  open: boolean;
  width: number;
  messages: ChatMessage[];
  typing: boolean;
  onClose: () => void;
  onSend: (text: string) => void;
  onResizeStart: (e: React.MouseEvent) => void;
  dnd: Dnd;
}

function Orb() {
  return (
    <Box sx={{ width: 26, height: 26, borderRadius: 1, flex: "none", display: "grid", placeItems: "center", background: "linear-gradient(135deg, var(--faro), var(--faro-2))", color: "#fff", fontSize: 12 }}>
      <FontAwesomeIcon icon={ICON.faro} size="sm" />
    </Box>
  );
}

function Msg({ m, onQuick }: { m: ChatMessage; onQuick: (q: string) => void }) {
  if (m.role === "me")
    return (
      <Box sx={{ alignSelf: "flex-end", maxWidth: "85%", bgcolor: "primary.main", color: "#fff", borderRadius: "14px 14px 4px 14px", px: 1.6, py: 1.1, fontSize: 13, fontWeight: 600 }}>
        {m.text}
      </Box>
    );
  return (
    <Box sx={{ display: "flex", gap: 1, alignItems: "flex-start", maxWidth: "92%" }}>
      <Orb />
      <Box>
        <Box sx={{ bgcolor: "var(--faro-soft)", borderRadius: "5px 14px 14px 14px", px: 1.6, py: 1.2, fontSize: 13, lineHeight: 1.5 }}>{m.text}</Box>
        {m.quick && (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75, mt: 1 }}>
            {m.quick.map((q, i) => (
              <Button key={i} size="small" variant="outlined" onClick={() => onQuick(q)} sx={{ ...faroOutlinedSx, fontSize: 11.5 }}>
                {q}
              </Button>
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default function FaroChat({ open, width, messages, typing, onClose, onSend, onResizeStart, dnd }: FaroChatProps) {
  const bodyRef = useRef<HTMLDivElement>(null);
  const [val, setVal] = useState("");

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [messages, typing, open]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (val.trim()) {
      onSend(val.trim());
      setVal("");
    }
  };

  return (
    <Drawer anchor="right" variant="persistent" open={open} PaperProps={{ sx: { width, position: "relative", borderLeft: "1px solid", borderColor: "divider" } }}>
      <Box className="faro-resize" onMouseDown={onResizeStart} />
      <Box
        onDragOver={(e: React.DragEvent) => dnd.allowDrop(e, "faro-panel")}
        onDragLeave={() => dnd.leave("faro-panel")}
        onDrop={(e: React.DragEvent) => dnd.onDrop(e, "faro-chat")}
        sx={{ display: "flex", flexDirection: "column", height: "100%", outline: dnd.over === "faro-panel" ? "3px solid var(--faro)" : "none", outlineOffset: -3 }}
      >
        <Box sx={{ p: 2, display: "flex", alignItems: "center", gap: 1.25, borderBottom: "1px solid", borderColor: "divider", background: "linear-gradient(180deg, var(--faro-soft), #fff)" }}>
          <Box sx={{ width: 36, height: 36, borderRadius: 1.5, display: "grid", placeItems: "center", background: "linear-gradient(135deg, var(--faro), var(--faro-2))", color: "#fff" }}>
            <FontAwesomeIcon icon={ICON.faro} />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography sx={{ fontWeight: 800, fontSize: 15 }}>Faro</Typography>
            <Typography sx={{ fontSize: 11, color: "var(--faro-strong)", fontWeight: 700 }}>online · pronto ad agire</Typography>
          </Box>
          <IconButton size="small" onClick={onClose}>
            <FontAwesomeIcon icon={faXmark} />
          </IconButton>
        </Box>

        <Box className="faro-body" ref={bodyRef} sx={{ flex: 1, overflowY: "auto", p: 2, display: "flex", flexDirection: "column", gap: 1.5 }}>
          {messages.map((m, i) => (
            <Msg key={i} m={m} onQuick={onSend} />
          ))}
          {typing && (
            <Box sx={{ display: "flex", gap: 1 }}>
              <Orb />
              <Box sx={{ bgcolor: "action.hover", borderRadius: "5px 14px 14px 14px", px: 1.5, py: 1, fontSize: 13 }}>• • •</Box>
            </Box>
          )}
        </Box>

        <Box component="form" onSubmit={submit} sx={{ p: 1.5, borderTop: "1px solid", borderColor: "divider", display: "flex", gap: 1 }}>
          <TextField size="small" fullWidth placeholder="Scrivi a Faro…" value={val} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setVal(e.target.value)} />
          <IconButton type="submit" sx={{ bgcolor: "var(--faro)", color: "#fff", "&:hover": { bgcolor: "var(--faro-strong)" } }}>
            <FontAwesomeIcon icon={faPaperPlane} />
          </IconButton>
        </Box>
      </Box>
    </Drawer>
  );
}
