import { useMemo, useState } from "react";
import AppShell from "./shell/AppShell";
import Board from "./board/Board";
import FaroPanel from "./chat/FaroPanel";
import FaroRail from "./chat/FaroRail";
import SourcePopover from "./popover/SourcePopover";
import Toasts from "./feedback/Toasts";
import Icon from "./components/Icon";
import PreviewModal from "./modals/PreviewModal";
import SettleModal from "./modals/SettleModal";
import ThreadModal from "./modals/ThreadModal";
import DetailModal from "./modals/DetailModal";
import ConfirmAllModal from "./modals/ConfirmAllModal";
import AutoSollecitiModal from "./modals/AutoSollecitiModal";
import ValueCenter from "./pages/ValueCenter";
import Upgrade from "./pages/Upgrade";
import Permessi from "./pages/Permessi";
import { useToast } from "./hooks/useToast";
import { useFaroChat } from "./hooks/useFaroChat";
import { useFaroBoard } from "./hooks/useFaroBoard";
import { DEFAULT_PERMS } from "./data/domain";
import type { CardHandlers } from "./card/ActionCard";
import type { FaroAction, PermsState, View } from "./types";

import "./faro.css";

interface CardRef {
  id: string;
}

/** Centrale operativa Faro: board "chi fa cosa", chat, pagine e modali. */
export default function FaroApp() {
  const [view, setView] = useState<View>("board");
  const [hideComm, setHideComm] = useState(false);
  const [hideDone, setHideDone] = useState<Record<string, boolean>>({});
  const [perms, setPerms] = useState<PermsState>(DEFAULT_PERMS);

  const [confirmAll, setConfirmAll] = useState(false);
  const [settle, setSettle] = useState<CardRef | null>(null);
  const [preview, setPreview] = useState<CardRef | null>(null);
  const [note, setNote] = useState<CardRef | null>(null);
  const [detail, setDetail] = useState<CardRef | null>(null);
  const [autoModal, setAutoModal] = useState<{ client: string } | null>(null);
  const [srcPop, setSrcPop] = useState<{ a: FaroAction; rect: DOMRect } | null>(null);

  const toast = useToast();
  const chat = useFaroChat();
  const board = useFaroBoard({
    notify: toast.notify,
    openPreview: (id) => setPreview({ id }),
    openAutoModal: (client) => setAutoModal({ client }),
    chat: { open: () => chat.setOpen(true), pushUser: chat.pushUser, faroSay: chat.faroSay },
  });

  const cardHandlers: CardHandlers = useMemo(
    () => ({
      onDragStart: board.dnd.onDragStart,
      onDragEnd: board.dnd.onDragEnd,
      onSource: (a, rect) => setSrcPop((prev) => (prev?.a.id === a.id ? null : { a, rect })),
      askNormo: board.askNormo,
      runFaro: board.runFaro,
      openDetail: (id) => setDetail({ id }),
      openSettle: (id) => setSettle({ id }),
      openNote: (id) => setNote({ id }),
    }),
    [board.dnd.onDragStart, board.dnd.onDragEnd, board.askNormo, board.runFaro],
  );

  const find = (ref: CardRef | null) => (ref ? board.getById(ref.id) : null);

  const headerRight =
    hideComm && view === "board" ? (
      <button className="show-comm" onClick={() => setHideComm(false)}>
        <Icon name="Building" size={15} />
        Mostra commercialista
      </button>
    ) : null;

  return (
    <AppShell view={view} setView={setView} headerRight={headerRight}>
      {view === "value" ? (
        <ValueCenter onHome={() => setView("board")} onUpgrade={() => setView("upgrade")} />
      ) : view === "upgrade" ? (
        <Upgrade onHome={() => setView("board")} onBack={() => setView("value")} notify={toast.notify} />
      ) : view === "permessi" ? (
        <Permessi perms={perms} setPerms={setPerms} onHome={() => setView("board")} notify={toast.notify} />
      ) : (
        <div className="stage">
          <Board
            actions={board.actions}
            dnd={board.dnd}
            cardHandlers={cardHandlers}
            autoTypes={board.autoTypes}
            hideComm={hideComm}
            hideDone={hideDone}
            toggleHideDone={(k) => setHideDone((h) => ({ ...h, [k]: !h[k] }))}
            onHideCol={() => setHideComm(true)}
            confirmAll={() => setConfirmAll(true)}
            autoPromo={board.autoPromo}
            onAutoYes={board.enableAutoSolleciti}
            onAutoNo={board.dismissAutoPromo}
          />
          {chat.open ? (
            <FaroPanel messages={chat.messages} typing={chat.typing} width={chat.width} onClose={() => chat.setOpen(false)} onSend={board.sendMessage} onResizeStart={chat.onResizeStart} dnd={board.dnd} />
          ) : (
            <FaroRail onOpen={() => chat.setOpen(true)} dnd={board.dnd} />
          )}
        </div>
      )}

      {preview && (
        <PreviewModal
          a={find(preview)}
          onCancel={() => setPreview(null)}
          onConfirm={(edited) => {
            const id = preview.id;
            setPreview(null);
            board.execFaro(id, edited);
          }}
        />
      )}
      {settle && (
        <SettleModal
          a={find(settle)}
          onCancel={() => setSettle(null)}
          onConfirm={({ date, conto }) => {
            board.markSettled(settle.id, date, conto);
            setSettle(null);
          }}
        />
      )}
      {note && <ThreadModal a={find(note)} onCancel={() => setNote(null)} onSend={(text) => board.addNote(note.id, text)} />}
      {detail && <DetailModal a={find(detail)} onClose={() => setDetail(null)} onExt={(label) => toast.notify({ icon: "ArrowUR", color: "var(--brand)", title: label, msg: "Apertura fuori da questa dashboard (non inclusa nel prototipo)" })} />}
      {confirmAll && (
        <ConfirmAllModal
          count={board.pendingCount}
          onCancel={() => setConfirmAll(false)}
          onConfirm={() => {
            setConfirmAll(false);
            board.confirmAllFaro();
          }}
        />
      )}
      {autoModal && (
        <AutoSollecitiModal
          client={autoModal.client}
          onCancel={() => setAutoModal(null)}
          onConfirm={(cfg) => {
            setAutoModal(null);
            board.activateAutoSolleciti(cfg);
          }}
        />
      )}
      {srcPop && <SourcePopover a={srcPop.a} rect={srcPop.rect} onClose={() => setSrcPop(null)} />}

      <Toasts toasts={toast.toasts} />
    </AppShell>
  );
}
