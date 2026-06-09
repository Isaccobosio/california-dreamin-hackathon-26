import { useEffect, useRef } from "react";
import Icon from "../components/Icon";
import ChatMessage from "./ChatMessage";
import ChatComposer from "./ChatComposer";
import type { Dnd } from "../hooks/useFaroBoard";
import type { ChatMessage as Msg } from "../types";

interface Props {
  messages: Msg[];
  typing: boolean;
  width: number;
  onClose: () => void;
  onSend: (text: string) => void;
  onResizeStart: (e: React.MouseEvent) => void;
  dnd: Dnd;
}

/** Pannello chat laterale con Faro: header, thread, droplay e composer. */
export default function FaroPanel({ messages, typing, width, onClose, onSend, onResizeStart, dnd }: Props) {
  const bodyRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [messages, typing]);

  return (
    <div
      className={`faro-panel${dnd.over === "faro-panel" ? " drop-on" : ""}`}
      style={{ position: "relative", width }}
      onDragOver={(e) => dnd.allowDrop(e, "faro-panel")}
      onDragLeave={() => dnd.leave("faro-panel")}
      onDrop={(e) => dnd.onDrop(e, "faro-chat")}
    >
      <div className="chat-resize" onMouseDown={onResizeStart} title="Trascina per ridimensionare la chat" />

      <div className="fp-head">
        <div className="lamp ai-circle">
          <Icon name="Sparkle" size={19} />
        </div>
        <div>
          <b>Faro</b>
          <div className="stt">
            <i />
            online · pronto ad agire
          </div>
        </div>
        <button className="x" title="Comprimi" onClick={onClose}>
          <Icon name="Panel" size={18} />
        </button>
      </div>

      <div className="fp-body" ref={bodyRef}>
        {messages.map((m, i) => (
          <ChatMessage key={i} m={m} onQuick={onSend} />
        ))}
        {typing && (
          <div className="msg faro">
            <div className="mo">
              <Icon name="Sparkle" size={13} />
            </div>
            <div className="bub">
              <span className="dots">
                <span />
                <span />
                <span />
              </span>
            </div>
          </div>
        )}
      </div>

      {dnd.over === "faro-panel" && (
        <div className="fp-droplay">
          <div className="qbtn" style={{ fontSize: 14, padding: "10px 16px" }}>
            ✦ Affida a Faro
          </div>
        </div>
      )}

      <div className="fp-foot">
        <ChatComposer onSend={onSend} />
      </div>
    </div>
  );
}
