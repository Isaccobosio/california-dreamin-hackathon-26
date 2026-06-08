import { useCallback, useMemo, useReducer } from "react";
import type { FaroAction, ThreadNote } from "../types";
import { SEED } from "../data/seed";
import { explainFaro, faroHandle } from "../data/conversation";

const WORK_MSG = "Faro ci sta lavorando…";

/** Effetti esterni iniettati: toast, dialog email e pannello chat. */
export interface FaroBoardDeps {
  notify: (title: string, msg?: string) => void;
  openEmail: (id: string) => void;
  chat: {
    open: () => void;
    pushUser: (text: string) => void;
    faroSay: (bubble: { text: string; quick?: string[] }, delay?: number) => void;
  };
}

interface State {
  actions: FaroAction[];
  drag: string | null;
  over: string | null;
  pendingFaro: string | null;
}

type ReducerAction =
  | { type: "PATCH"; id: string; patch: Partial<FaroAction> }
  | { type: "WORK_MANY"; ids: string[] }
  | { type: "COMPLETE"; id: string }
  | { type: "COMPLETE_MANY"; ids: string[] }
  | { type: "ADD_NOTE"; id: string; note: ThreadNote }
  | { type: "DRAG_START"; id: string }
  | { type: "DRAG_END" }
  | { type: "SET_OVER"; key: string }
  | { type: "LEAVE"; key: string }
  | { type: "SET_PENDING"; id: string | null };

function init(): State {
  return {
    actions: SEED.map((a) => ({
      ...a,
      assignee: a.suggest ?? null,
      phase: a.suggest === "comm" ? "taken" : a.suggest ? "todo" : null,
      doneMsg: null,
    })),
    drag: null,
    over: null,
    pendingFaro: null,
  };
}

function mapById(actions: FaroAction[], ids: string[], patch: (a: FaroAction) => FaroAction): FaroAction[] {
  const set = new Set(ids);
  return actions.map((a) => (set.has(a.id) ? patch(a) : a));
}

function reducer(state: State, action: ReducerAction): State {
  switch (action.type) {
    case "PATCH":
      return { ...state, actions: state.actions.map((a) => (a.id === action.id ? { ...a, ...action.patch } : a)) };
    case "WORK_MANY":
      return { ...state, actions: mapById(state.actions, action.ids, (a) => ({ ...a, phase: "work", doneMsg: WORK_MSG })) };
    case "COMPLETE":
      return { ...state, actions: state.actions.map((a) => (a.id === action.id ? { ...a, phase: "done", doneMsg: faroHandle(a).done } : a)) };
    case "COMPLETE_MANY":
      return { ...state, actions: mapById(state.actions, action.ids, (a) => ({ ...a, phase: "done", doneMsg: faroHandle(a).done })) };
    case "ADD_NOTE":
      return { ...state, actions: state.actions.map((a) => (a.id === action.id ? { ...a, thread: [...(a.thread ?? []), action.note] } : a)) };
    case "DRAG_START":
      return { ...state, drag: action.id };
    case "DRAG_END":
      return { ...state, drag: null, over: null };
    case "SET_OVER":
      return state.over === action.key ? state : { ...state, over: action.key };
    case "LEAVE":
      return state.over === action.key ? { ...state, over: null } : state;
    case "SET_PENDING":
      return { ...state, pendingFaro: action.id };
    default:
      return state;
  }
}

/**
 * Cuore della board: stato delle card, drag&drop e handler di assegnazione/
 * esecuzione. Tutte le azioni sono simulate lato UI (transizioni di stato +
 * effetti iniettati su toast/chat).
 */
export function useFaroBoard(deps: FaroBoardDeps) {
  const [state, dispatch] = useReducer(reducer, undefined, init);
  const { actions, drag, over, pendingFaro } = state;

  const getById = useCallback((id: string) => actions.find((a) => a.id === id) ?? null, [actions]);

  const patch = useCallback((id: string, p: Partial<FaroAction>) => dispatch({ type: "PATCH", id, patch: p }), []);

  /** Esecuzione vera (dopo eventuale anteprima): work → done. */
  const execFaro = useCallback(
    (id: string) => {
      const a = getById(id);
      if (!a) return;
      dispatch({ type: "PATCH", id, patch: { assignee: "faro", phase: "work", doneMsg: WORK_MSG } });
      deps.notify("Faro ha preso in carico l'attività", `${a.title} · ${a.client}`);
      window.setTimeout(() => dispatch({ type: "COMPLETE", id }), 1600);
    },
    [getById, deps],
  );

  /** Click "Lascia fare a Faro": sollecito → anteprima email, altri → esegue. */
  const runFaro = useCallback(
    (id: string) => {
      const a = getById(id);
      if (!a) return;
      if (a.kind === "sollecito") deps.openEmail(id);
      else execFaro(id);
    },
    [getById, deps, execFaro],
  );

  /** Drop nella chat → Faro spiega e chiede conferma. */
  const proposeFaro = useCallback(
    (id: string) => {
      const a = getById(id);
      if (!a) return;
      deps.chat.open();
      dispatch({ type: "SET_PENDING", id });
      dispatch({ type: "PATCH", id, patch: { assignee: "faro", phase: "ask", doneMsg: "In attesa di conferma in chat" } });
      deps.chat.pushUser(`Passo a Faro: ${a.title.toLowerCase()} (${a.client})`);
      deps.chat.faroSay({ text: explainFaro(a) + " Vuoi che la prenda in carico?", quick: ["Sì, prendila in carico", "No, la gestisco io"] }, 850);
    },
    [getById, deps],
  );

  const delegateComm = useCallback(
    (id: string) => {
      const a = getById(id);
      if (!a) return;
      dispatch({ type: "PATCH", id, patch: { assignee: "comm", phase: "taken", doneMsg: "Presa in carico da Luca" } });
      deps.notify("Passata al commercialista", `${a.title} → Luca Ferri`);
    },
    [getById, deps],
  );

  const unassign = useCallback((id: string) => dispatch({ type: "PATCH", id, patch: { assignee: null, phase: null, doneMsg: null } }), []);

  const pendingCount = useMemo(() => actions.filter((a) => a.assignee === "faro" && a.phase === "todo").length, [actions]);

  /** Conferma in blocco: esegue tutte le azioni in colonna Faro ancora "todo". */
  const confirmAllFaro = useCallback(() => {
    const ids = actions.filter((a) => a.assignee === "faro" && a.phase === "todo").map((a) => a.id);
    if (!ids.length) return;
    deps.notify(`Faro sta eseguendo ${ids.length} azioni`);
    dispatch({ type: "WORK_MANY", ids });
    window.setTimeout(() => dispatch({ type: "COMPLETE_MANY", ids }), 1800);
  }, [actions, deps]);

  /** Segna come saldata (dialog SettleDialog). */
  const markSettled = useCallback(
    (id: string, date: string, conto: string) => {
      const a = getById(id);
      dispatch({ type: "PATCH", id, patch: { phase: "done", doneMsg: `Saldata il ${date} · ${conto}` } });
      deps.notify("Segnata come saldata", a ? `${a.amount} · ${conto}` : conto);
    },
    [getById, deps],
  );

  /** Invia una nota al commercialista; Luca risponde dopo poco (mock). */
  const addNote = useCallback(
    (id: string, text: string) => {
      dispatch({ type: "ADD_NOTE", id, note: { author: "me", name: "Mario Rossi", text, time: "ora" } });
      deps.notify("Nota inviata a Luca");
      window.setTimeout(
        () => dispatch({ type: "ADD_NOTE", id, note: { author: "luca", name: "Luca Ferri", text: "Ricevuto, ci penso io e ti aggiorno a breve.", time: "ora" } }),
        1600,
      );
    },
    [deps],
  );

  /** Router messaggi della chat (keyword matching mock). */
  const sendMessage = useCallback(
    (text: string) => {
      deps.chat.open();
      deps.chat.pushUser(text);
      const low = text.toLowerCase();

      if ((low.includes("prendila in carico") || low.includes("prendi in carico")) && pendingFaro) {
        const id = pendingFaro;
        dispatch({ type: "SET_PENDING", id: null });
        execFaro(id);
        return;
      }
      if (low.includes("gestisco io") && pendingFaro) {
        const id = pendingFaro;
        dispatch({ type: "SET_PENDING", id: null });
        unassign(id);
        deps.chat.faroSay({ text: "Va bene, la rimetto tra le azioni da assegnare." }, 600);
        return;
      }

      if (low.includes("puoi fare") || low.includes("cosa fai")) {
        deps.chat.faroSay({ text: "Invio solleciti, trasmetto allo SDI, riconcilio i movimenti, confermo le ricorrenti e registro gli incassi. Le pratiche fiscali le lascio a Luca." }, 800);
      } else if (low.includes("parto") || low.includes("priorit")) {
        deps.chat.faroSay({ text: "Partirei dalle 2 fatture scadute (€ 12.444 fermi): premi “Lascia fare a Faro” e invio i solleciti." }, 800);
      } else {
        deps.chat.faroSay({ text: "Ricevuto. Trascinami una card o chiedimi “da dove parto?”.", quick: ["Da dove parto?", "Cosa puoi fare tu?"] }, 800);
      }
    },
    [deps, pendingFaro, execFaro, unassign],
  );

  // Drag & drop (HTML5 nativo)
  const onDragStart = useCallback((e: React.DragEvent, id: string) => {
    dispatch({ type: "DRAG_START", id });
    e.dataTransfer.effectAllowed = "move";
    try {
      e.dataTransfer.setData("text/plain", id);
    } catch {
      /* alcuni browser bloccano setData fuori da un gesto utente */
    }
  }, []);
  const onDragEnd = useCallback(() => dispatch({ type: "DRAG_END" }), []);
  const allowDrop = useCallback((e: React.DragEvent, key: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    dispatch({ type: "SET_OVER", key });
  }, []);
  const leave = useCallback((key: string) => dispatch({ type: "LEAVE", key }), []);
  const onDrop = useCallback(
    (e: React.DragEvent, target: string) => {
      e.preventDefault();
      const id = drag || e.dataTransfer.getData("text/plain");
      dispatch({ type: "DRAG_END" });
      if (!id) return;
      if (target === "faro-chat") proposeFaro(id);
      else if (target === "faro") runFaro(id);
      else if (target === "comm") delegateComm(id);
      else if (target === "me") patch(id, { assignee: "me", phase: "todo", doneMsg: null });
      else unassign(id);
    },
    [drag, proposeFaro, runFaro, delegateComm, patch, unassign],
  );

  const dnd = useMemo(
    () => ({ drag, over, onDragStart, onDragEnd, allowDrop, leave, onDrop }),
    [drag, over, onDragStart, onDragEnd, allowDrop, leave, onDrop],
  );

  return {
    actions,
    dnd,
    getById,
    pendingCount,
    runFaro,
    delegateComm,
    execFaro,
    confirmAllFaro,
    markSettled,
    addNote,
    sendMessage,
  };
}

export type UseFaroBoard = ReturnType<typeof useFaroBoard>;
export type Dnd = UseFaroBoard["dnd"];
