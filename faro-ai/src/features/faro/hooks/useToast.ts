import { useCallback, useState } from "react";
import type { IconName } from "../components/Icon";
import type { Toast } from "../types";

let seq = 0;

/** Notifica toast in arrivo (senza id, assegnato internamente). */
export type ToastInput = { icon?: IconName; color?: string; title: string; msg?: string };

/** Coda di toast impilati in basso a destra, con auto-dismiss. */
export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const notify = useCallback((t: ToastInput) => {
    const id = `T${seq++}`;
    const toast: Toast = { id, icon: t.icon ?? "Check", color: t.color, title: t.title, msg: t.msg };
    setToasts((x) => [...x, toast]);
    window.setTimeout(() => setToasts((x) => x.filter((y) => y.id !== id)), 4200);
  }, []);

  return { toasts, notify };
}

export type UseToast = ReturnType<typeof useToast>;
