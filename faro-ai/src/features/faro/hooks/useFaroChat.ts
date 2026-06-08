import { useCallback, useRef, useState } from "react";
import type { ChatMessage, FaroBubble } from "../types";

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    role: "faro",
    text: "Ciao Mario 👋 Sono Faro. Ho già pre-assegnato le attività; due non sapevo a chi darle, le trovi in “Da assegnare”. Trascina pure dove vuoi.",
    quick: ["Cosa puoi fare tu?", "Da dove parto?"],
  },
];

const MIN_WIDTH = 300;
const MAX_WIDTH = 560;
const DEFAULT_WIDTH = 360;

/**
 * Stato puro del pannello chat: messaggi, indicatore "sta scrivendo",
 * apertura e ridimensionamento. Non contiene logica di intent: il routing
 * dei messaggi vive in {@link useFaroBoard}, che inietta qui le bolle.
 */
export function useFaroChat() {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [typing, setTyping] = useState(false);
  const [open, setOpen] = useState(false);
  const [width, setWidth] = useState(DEFAULT_WIDTH);

  /** Aggiunge un messaggio dell'utente. */
  const pushUser = useCallback((text: string) => {
    setMessages((prev) => [...prev, { role: "me", text }]);
  }, []);

  /** Risposta di Faro dopo un breve "sta scrivendo…". */
  const faroSay = useCallback((bubble: FaroBubble, delay = 800) => {
    setTyping(true);
    window.setTimeout(() => {
      setTyping(false);
      setMessages((prev) => [...prev, { role: "faro", ...bubble }]);
    }, delay);
  }, []);

  const resizing = useRef(false);
  const onResizeStart = useCallback((e: React.MouseEvent) => {
    resizing.current = true;
    e.preventDefault();
    const move = (ev: MouseEvent) => {
      if (resizing.current) {
        setWidth(Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, window.innerWidth - ev.clientX)));
      }
    };
    const up = () => {
      resizing.current = false;
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
  }, []);

  return { messages, typing, open, setOpen, width, pushUser, faroSay, onResizeStart };
}

export type UseFaroChat = ReturnType<typeof useFaroChat>;
