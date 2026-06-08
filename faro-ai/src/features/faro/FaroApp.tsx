import { useMemo, useState } from "react";
import { Box, Button, Snackbar, Alert } from "@vapor/react-material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import TopBar from "./components/TopBar";
import Board, { type BoardHandlers } from "./components/Board";
import FaroChat from "./components/FaroChat";
import ConfirmAllDialog from "./components/dialogs/ConfirmAllDialog";
import SettleDialog from "./components/dialogs/SettleDialog";
import EmailDialog from "./components/dialogs/EmailDialog";
import DetailDialog from "./components/dialogs/DetailDialog";
import NoteDialog from "./components/dialogs/NoteDialog";
import ValueCenter from "./pages/ValueCenter";
import Upgrade from "./pages/Upgrade";
import Permessi from "./pages/Permessi";
import { useToast } from "./hooks/useToast";
import { useFaroChat } from "./hooks/useFaroChat";
import { useFaroBoard } from "./hooks/useFaroBoard";
import { ICON } from "./data/icons";
import type { View } from "./types";

import "./faro.css";

/** Riferimento a una card per i dialog (per id). */
interface CardRef {
  id: string;
}

export default function FaroApp() {
  const [view, setView] = useState<View>("board");
  const [hideComm, setHideComm] = useState(false);
  const [hideDone, setHideDone] = useState<Record<string, boolean>>({});

  // Stato dei modali (riferimento alla card o flag)
  const [confirmAll, setConfirmAll] = useState(false);
  const [settle, setSettle] = useState<CardRef | null>(null);
  const [email, setEmail] = useState<CardRef | null>(null);
  const [detail, setDetail] = useState<CardRef | null>(null);
  const [note, setNote] = useState<CardRef | null>(null);

  const toast = useToast();
  const chat = useFaroChat();
  const board = useFaroBoard({
    notify: toast.notify,
    openEmail: (id) => setEmail({ id }),
    chat: { open: () => chat.setOpen(true), pushUser: chat.pushUser, faroSay: chat.faroSay },
  });

  const handlers: BoardHandlers = useMemo(
    () => ({
      runFaro: board.runFaro,
      openDetail: (id) => setDetail({ id }),
      openSettle: (id) => setSettle({ id }),
      openNote: (id) => setNote({ id }),
      confirmAll: () => setConfirmAll(true),
    }),
    [board.runFaro],
  );

  const find = (ref: CardRef | null) => (ref ? board.getById(ref.id) : null);

  return (
    <Box sx={{ height: "100vh", display: "flex", flexDirection: "column", bgcolor: "background.default" }}>
      <TopBar view={view} setView={setView} />

      {view === "value" ? (
        <ValueCenter onHome={() => setView("board")} onUpgrade={() => setView("upgrade")} />
      ) : view === "upgrade" ? (
        <Upgrade onHome={() => setView("board")} onBack={() => setView("value")} notify={toast.notify} />
      ) : view === "permessi" ? (
        <Permessi onHome={() => setView("board")} />
      ) : (
        <Box sx={{ flex: 1, display: "flex", minHeight: 0 }}>
          <Board
            actions={board.actions}
            hideComm={hideComm}
            setHideComm={setHideComm}
            dnd={board.dnd}
            handlers={handlers}
            hideDone={hideDone}
            toggleHideDone={(k) => setHideDone((h) => ({ ...h, [k]: !h[k] }))}
          />
          {chat.open ? (
            <FaroChat open width={chat.width} messages={chat.messages} typing={chat.typing} onClose={() => chat.setOpen(false)} onSend={board.sendMessage} onResizeStart={chat.onResizeStart} dnd={board.dnd} />
          ) : (
            <Box
              onDragOver={(e: React.DragEvent) => board.dnd.allowDrop(e, "faro-rail")}
              onDragLeave={() => board.dnd.leave("faro-rail")}
              onDrop={(e: React.DragEvent) => board.dnd.onDrop(e, "faro")}
              sx={{ width: 62, flex: "none", borderLeft: "1px solid", borderColor: "divider", bgcolor: "background.paper", display: "flex", flexDirection: "column", alignItems: "center", py: 2, outline: board.dnd.over === "faro-rail" ? "3px solid var(--faro)" : "none", outlineOffset: -3 }}
            >
              <Button sx={{ minWidth: 0, p: 1.25 }} onClick={() => chat.setOpen(true)} title="Apri Faro">
                <FontAwesomeIcon icon={ICON.faro} />
              </Button>
            </Box>
          )}
        </Box>
      )}

      {hideComm && view === "board" && (
        <Button variant="outlined" color="success" onClick={() => setHideComm(false)} sx={{ position: "fixed", top: 72, right: 20, zIndex: 20 }} startIcon={<FontAwesomeIcon icon={ICON.faro} />}>
          Mostra commercialista
        </Button>
      )}

      <ConfirmAllDialog
        open={confirmAll}
        count={board.pendingCount}
        onCancel={() => setConfirmAll(false)}
        onConfirm={() => {
          setConfirmAll(false);
          board.confirmAllFaro();
        }}
      />
      {settle && (
        <SettleDialog
          a={find(settle)}
          onCancel={() => setSettle(null)}
          onConfirm={({ date, conto }) => {
            board.markSettled(settle.id, date, conto);
            setSettle(null);
          }}
        />
      )}
      {email && (
        <EmailDialog
          a={find(email)}
          onCancel={() => setEmail(null)}
          onConfirm={() => {
            const id = email.id;
            setEmail(null);
            board.execFaro(id);
          }}
        />
      )}
      {detail && <DetailDialog a={find(detail)} onClose={() => setDetail(null)} onExt={(label) => toast.notify(label, "Apertura fuori dalla dashboard (non inclusa)")} />}
      {note && <NoteDialog a={find(note)} onCancel={() => setNote(null)} onSend={(text) => board.addNote(note.id, text)} />}

      <Snackbar open={!!toast.toast} autoHideDuration={4000} onClose={toast.close} anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
        {toast.toast ? (
          <Alert severity="success" onClose={toast.close} sx={{ maxWidth: 340 }}>
            <b>{toast.toast.title}</b>
            {toast.toast.msg ? <div style={{ fontSize: 12, opacity: 0.85 }}>{toast.toast.msg}</div> : null}
          </Alert>
        ) : undefined}
      </Snackbar>
    </Box>
  );
}
