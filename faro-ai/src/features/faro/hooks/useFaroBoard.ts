import { useCallback, useMemo, useReducer, useRef, useState } from "react";
import type { Actor, FaroAction, ThreadNote } from "../types";
import { SEED, NEEDS_PREVIEW } from "../data/seed";
import { askNormoReply, explainFaro, faroHandle, lucaReply } from "../data/conversation";
import type { ToastInput } from "./useToast";

const WORK_MSG = "Faro ci sta lavorando…";
const AUTO_CLIENT = "Acme S.r.l.";

/** Configurazione restituita dal modale "Attiva solleciti automatici". */
export interface AutoSollecitiConfig {
  client: string;
  steps: { id: string; on: boolean; when: string; tone: string }[];
  scope: "one" | "late";
  stopOnPay: boolean;
  sendTime: string;
}

/** Effetti esterni iniettati: toast, anteprima, modale regola e pannello chat. */
export interface FaroBoardDeps {
  notify: (t: ToastInput) => void;
  openPreview: (id: string) => void;
  openAutoModal: (client: string) => void;
  chat: {
    open: () => void;
    pushUser: (text: string) => void;
    faroSay: (bubble: { role?: "faro" | "normo"; text: string; quick?: string[] }, delay?: number) => void;
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
 * Cuore della board: stato delle card, drag&drop, esecuzione/assegnazione,
 * auto-promozione dei solleciti e routing della chat. Tutto simulato lato UI.
 */
export function useFaroBoard(deps: FaroBoardDeps) {
  const [state, dispatch] = useReducer(reducer, undefined, init);
  const { actions, drag, over, pendingFaro } = state;

  const [autoTypes, setAutoTypes] = useState<string[]>([]);
  const [autoPromo, setAutoPromo] = useState(false);
  const autoTypesRef = useRef<string[]>([]);
  const promoRef = useRef(false);
  autoTypesRef.current = autoTypes;

  const getById = useCallback((id: string) => actions.find((a) => a.id === id) ?? null, [actions]);
  const patch = useCallback((id: string, p: Partial<FaroAction>) => dispatch({ type: "PATCH", id, patch: p }), []);

  /** Esecuzione vera (dopo eventuale anteprima): work → done, poi auto-promozione. */
  const execFaro = useCallback(
    (id: string, edited?: boolean) => {
      const a = getById(id);
      if (!a) return;
      const h = faroHandle(a);
      dispatch({ type: "PATCH", id, patch: { assignee: "faro", phase: "work", doneMsg: WORK_MSG } });
      deps.chat.pushUser(`Affido a Faro: ${a.title.toLowerCase()} (${a.client})`);
      deps.chat.faroSay({ text: edited ? h.text + " (con il testo che hai modificato)" : h.text }, 800);
      deps.notify({ icon: "Sparkle", color: "var(--faro)", title: "Faro ha preso in carico l'attività", msg: `${a.title} · ${a.client}` });
      window.setTimeout(() => {
        dispatch({ type: "COMPLETE", id });
        deps.notify({ icon: "Check", title: h.done });
        if (a.autopromo && a.kind === "sollecito" && !autoTypesRef.current.includes("sollecito")) {
          setAutoPromo(true);
          if (!promoRef.current) {
            promoRef.current = true;
            deps.notify({ icon: "Sparkle", color: "var(--faro)", title: "Faro propone un'automazione", msg: "Vedi il riquadro in cima alla colonna Faro" });
            deps.chat.faroSay(
              { text: `Ho notato una cosa: ${a.client} paga sempre in ritardo e tu confermi sempre il sollecito. Vuoi che da ora invii il sollecito da solo, senza chiedertelo?`, quick: ["Attiva solleciti automatici", "No, chiedimi sempre"] },
              1400,
            );
          }
        }
      }, 1700);
    },
    [getById, deps],
  );

  /** Click "Delega a Faro": tipi con anteprima → modale, altri → esegue. */
  const runFaro = useCallback(
    (id: string) => {
      const a = getById(id);
      if (!a) return;
      if (NEEDS_PREVIEW.includes(a.kind) && !autoTypesRef.current.includes(a.kind)) deps.openPreview(id);
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
    (id: string, viaDrag?: boolean) => {
      const a = getById(id);
      if (!a) return;
      dispatch({ type: "PATCH", id, patch: { assignee: "comm", phase: "taken", doneMsg: "Presa in carico da Luca" } });
      deps.notify({ icon: "Building", color: "var(--comm)", title: "Passata al commercialista", msg: `${a.title} → Luca Ferri, con tutti gli allegati.` });
      if (viaDrag && a.suggest !== "comm") deps.chat.faroSay({ text: "Ok, la giro a Luca 🙂" }, 600);
    },
    [getById, deps],
  );

  const markCommDone = useCallback(
    (id: string) => {
      dispatch({ type: "PATCH", id, patch: { phase: "done", doneMsg: "Eseguita da Luca ✓" } });
      deps.notify({ icon: "Check", color: "var(--comm)", title: "Pratica eseguita da Luca" });
    },
    [deps],
  );

  const unassign = useCallback((id: string) => dispatch({ type: "PATCH", id, patch: { assignee: null, phase: null, doneMsg: null } }), []);
  const setTodo = useCallback((id: string, col: Actor) => dispatch({ type: "PATCH", id, patch: { assignee: col, phase: "todo", doneMsg: null } }), []);
  const completeSelf = useCallback((id: string) => dispatch({ type: "PATCH", id, patch: { phase: "done", doneMsg: "Completata da te ✓" } }), []);
  const hideCard = useCallback((id: string) => dispatch({ type: "PATCH", id, patch: { phase: "hidden" } }), []);

  const pendingCount = useMemo(() => actions.filter((a) => a.assignee === "faro" && a.phase === "todo").length, [actions]);

  /** Conferma in blocco: esegue tutte le azioni in colonna Faro ancora "todo". */
  const confirmAllFaro = useCallback(() => {
    const ids = actions.filter((a) => a.assignee === "faro" && a.phase === "todo").map((a) => a.id);
    if (!ids.length) return;
    deps.notify({ icon: "Sparkle", color: "var(--faro)", title: `Faro sta eseguendo ${ids.length} azioni` });
    dispatch({ type: "WORK_MANY", ids });
    deps.chat.pushUser(`Automatizza tutte le azioni assegnate a Faro (${ids.length})`);
    deps.chat.faroSay({ text: "Perfetto, le gestisco tutte io. Procedo in sequenza…" }, 700);
    window.setTimeout(() => {
      dispatch({ type: "COMPLETE_MANY", ids });
      deps.notify({ icon: "Check", title: `${ids.length} azioni completate da Faro` });
      deps.chat.faroSay({ text: `Fatto ✓ Completate le ${ids.length} azioni — le trovi risolte nella mia colonna.`, quick: ["Mostrami il riepilogo", "Perfetto"] }, 1900);
    }, 2100);
  }, [actions, deps]);

  /** Segna come saldata (dialog SettleDialog). */
  const markSettled = useCallback(
    (id: string, date: string, conto: string) => {
      const a = getById(id);
      dispatch({ type: "PATCH", id, patch: { phase: "done", doneMsg: `Saldata il ${date} · ${conto}` } });
      deps.notify({ icon: "Check", title: "Segnata come saldata", msg: a ? `${a.amount} · ${conto}` : conto });
    },
    [getById, deps],
  );

  /** Invia una nota al commercialista; Luca risponde dopo poco (mock). */
  const addNote = useCallback(
    (id: string, text: string) => {
      const t = text.trim();
      if (!t) return;
      dispatch({ type: "ADD_NOTE", id, note: { author: "me", name: "Mario Rossi", text: t, time: "ora" } });
      deps.notify({ icon: "Send", color: "var(--comm)", title: "Nota inviata a Luca", msg: "La riceve nello studio." });
      const a = getById(id);
      window.setTimeout(() => dispatch({ type: "ADD_NOTE", id, note: { author: "luca", name: "Luca Ferri", text: lucaReply(a ?? { kind: "f24" }), time: "ora" } }), 1600);
    },
    [getById, deps],
  );

  /** "Chiedi a normo.AI": consulto normativo in chat. */
  const askNormo = useCallback(
    (id: string) => {
      const a = getById(id);
      if (!a) return;
      deps.chat.open();
      deps.chat.pushUser(`Chiedi a normo.AI: ${a.title.toLowerCase()}`);
      deps.chat.faroSay(askNormoReply(a), 900);
    },
    [getById, deps],
  );

  /** Attivazione rapida (dal banner di auto-promozione). */
  const enableAutoSolleciti = useCallback(() => {
    setAutoTypes((a) => (a.includes("sollecito") ? a : [...a, "sollecito"]));
    setAutoPromo(false);
    deps.notify({ icon: "Sparkle", color: "var(--faro)", title: "Automatico attivo", msg: "D'ora in poi invio i solleciti da solo. Puoi disattivarlo quando vuoi." });
  }, [deps]);

  /** Chiude il banner di auto-promozione senza attivare nulla. */
  const dismissAutoPromo = useCallback(() => setAutoPromo(false), []);

  /** Attivazione completa (dal modale regola). */
  const activateAutoSolleciti = useCallback(
    (cfg: AutoSollecitiConfig) => {
      setAutoTypes((a) => (a.includes("sollecito") ? a : [...a, "sollecito"]));
      setAutoPromo(false);
      deps.notify({ icon: "Sparkle", color: "var(--faro)", title: "Solleciti automatici attivi", msg: cfg.scope === "one" ? cfg.client : "Tutti i clienti con pagamenti in ritardo" });
      deps.chat.faroSay(
        { text: `Fatto ✓ Regola attiva: invio in autonomia ${cfg.steps.filter((s) => s.on).length} promemoria a ${cfg.scope === "one" ? cfg.client : "i clienti in ritardo"}. Le card sollecito ora hanno il badge “Automatico”.` },
        600,
      );
    },
    [deps],
  );

  /** Router messaggi della chat (keyword matching mock). */
  const sendMessage = useCallback(
    (text: string) => {
      const t = text.trim();
      if (!t) return;
      deps.chat.open();
      deps.chat.pushUser(t);
      const low = t.toLowerCase();

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
        deps.chat.faroSay({ text: "Va bene, la rimetto tra le azioni da assegnare — la gestisci tu." }, 600);
        return;
      }

      if (low.includes("attiva solleciti automatici")) {
        deps.openAutoModal(AUTO_CLIENT);
        deps.chat.faroSay({ text: "Perfetto. Apro la configurazione della regola — controlla i promemoria e l'ordine d'invio, poi attiva." }, 700);
      } else if (low.includes("automatizza i solleciti")) {
        enableAutoSolleciti();
        deps.chat.faroSay({ text: "Fatto ✓ Da ora invio i solleciti in autonomia — sempre con anteprima nello storico. Le card sollecito ora hanno il badge “Automatico”." }, 700);
      } else if (low.includes("no, chiedimi")) {
        deps.chat.faroSay({ text: "Va bene, continuo a chiederti conferma prima di ogni sollecito." }, 600);
      } else if (low.includes("passa a luca")) {
        deps.chat.faroSay({ text: "Ok, la giro al commercialista con la segnalazione di normo.AI allegata." }, 700);
      } else if (low.includes("puoi fare") || low.includes("cosa fai") || low.includes("cosa puoi")) {
        deps.chat.faroSay({ text: "Invio solleciti, trasmetto allo SDI, riconcilio i movimenti, confermo le ricorrenti e registro gli incassi — sempre partendo da una fonte verificabile. Le pratiche fiscali le lascio a Luca.", quick: ["Da dove parto?"] }, 800);
      } else if (low.includes("parto") || low.includes("priorit")) {
        deps.chat.faroSay({ text: "Partirei dalle 2 fatture scadute (la più vecchia di 37 gg): sono in cima alla mia colonna. Premi “Conferma tutte le azioni” o aprile una a una.", quick: ["Mostrami il riepilogo"] }, 800);
      } else if (low.includes("riepilogo")) {
        deps.chat.faroSay({ text: "Oggi: 2 solleciti, 4 fatture allo SDI, 3 riconciliazioni. Il commercialista ha F24 e una fattura scartata. In gioco ci sono circa € 29.500." }, 800);
      } else {
        deps.chat.faroSay({ text: "Ricevuto. Trascinami una card o chiedimi “da dove parto?”.", quick: ["Da dove parto?", "Cosa puoi fare tu?"] }, 800);
      }
    },
    [deps, pendingFaro, execFaro, unassign, enableAutoSolleciti],
  );

  /** Assegnazione da drag&drop. */
  const assign = useCallback(
    (id: string, target: string | null) => {
      if (target === "faro") runFaro(id);
      else if (target === "faro-chat") proposeFaro(id);
      else if (target === "comm") delegateComm(id, true);
      else if (target === "me") setTodo(id, "me");
      else unassign(id);
    },
    [runFaro, proposeFaro, delegateComm, setTodo, unassign],
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
      assign(id, target === "inbox" ? null : target);
    },
    [drag, assign],
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
    autoTypes,
    autoPromo,
    runFaro,
    delegateComm,
    markCommDone,
    execFaro,
    confirmAllFaro,
    markSettled,
    addNote,
    askNormo,
    completeSelf,
    hideCard,
    setTodo,
    unassign,
    enableAutoSolleciti,
    activateAutoSolleciti,
    dismissAutoPromo,
    sendMessage,
  };
}

export type UseFaroBoard = ReturnType<typeof useFaroBoard>;
export type Dnd = UseFaroBoard["dnd"];
