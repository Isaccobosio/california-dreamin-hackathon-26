import { useCallback, useState } from "react";
import type { Toast } from "../types";

/** Stato di una singola notifica toast (Snackbar). */
export function useToast() {
  const [toast, setToast] = useState<Toast | null>(null);

  const notify = useCallback((title: string, msg?: string) => {
    setToast({ title, msg });
  }, []);

  const close = useCallback(() => setToast(null), []);

  return { toast, notify, close };
}

export type UseToast = ReturnType<typeof useToast>;
