/**
 * Tipi del dominio Faro.
 * Tutto mockato lato UI: nessuna azione raggiunge un backend.
 * Modello dati allineato alla fonte di design (faro-design-v2).
 */
import type { IconName } from "./components/Icon";

/** Tipo di azione (kind) — guida icona, CTA e comportamento di Faro. */
export type ActionKind =
  | "sollecito"
  | "sdi"
  | "riconcilia"
  | "ricorrente"
  | "incasso"
  | "scartata"
  | "f24"
  | "fornitore";

/** Tipo di fonte da cui nasce un task (popover "da dove arriva", spec §5). */
export type SourceKind = "fic" | "email" | "whatsapp" | "banca" | "calendario" | "regola" | "normo";

/** Una fonte cliccabile collegata a una card. */
export interface Source {
  kind: SourceKind;
  /** Dettaglio concreto (es. "Fattura #2026/138, scaduta il 2/5"). */
  detail: string;
  /** Etichetta del link "vai alla fonte" (es. "Apri in FIC"). */
  link?: string;
}

/** Livello di urgenza/colore: r = alto (rosso), a = medio (ambra), g = basso (verde). */
export type UrgencyLevel = "r" | "a" | "g";

/** Varianti badge/tag mappate sulle classi CSS (.badge.r ecc.). */
export type TagVariant = "r" | "a" | "g" | "d" | "f" | "b";

/** Sigillo normo.AI. */
export type NormoSeal = "verified" | "escalate";

/** Attori = colonne assegnabili della board. */
export type Actor = "me" | "comm" | "faro";

/** Chiavi colonna: gli attori + l'inbox "Da assegnare". */
export type ColumnKey = "inbox" | Actor;

/**
 * Fase di una card.
 * todo = da fare · work = Faro in lavorazione · ask = in attesa conferma in chat
 * done = completata · taken = presa in carico dal commercialista
 */
export type Phase = "todo" | "work" | "ask" | "done" | "taken" | "hidden" | null;

export interface Urgency {
  text: string;
  level: UrgencyLevel;
  /** Rank di ordinamento: minore = più urgente. */
  rank: number;
}

export interface ThreadNote {
  author: "luca" | "me";
  name: string;
  text: string;
  time: string;
}

/** Card-azione come definita nei dati seed. */
export interface SeedAction {
  id: string;
  kind: ActionKind;
  /** Icona della card (set inline {@link IconName}). */
  icon: IconName;
  /** Codice colore icona/dettaglio (r/a/b/d/f/g). */
  kic: string;
  title: string;
  client: string;
  sub: string;
  amount: string;
  /** Valore numerico (per le sintesi). */
  val: number;
  /** Tag fallback quando manca l'urgenza: [testo, variante]. */
  tag?: [string, TagVariant];
  urgency: Urgency;
  /** Attore pre-assegnato da Faro; null = incerto → inbox "Da assegnare". */
  suggest: Actor | null;
  /** Innesca l'auto-promozione dei solleciti (Acme paga sempre in ritardo). */
  autopromo?: boolean;
  /** Data fattura, usata nell'anteprima del sollecito. */
  fdate?: string;
  /** Catena di segnali (es. fattura FIC + bonifico banca → incasso). */
  chain?: string;
  /** Domanda di routing mostrata quando la card è incerta. */
  doubt?: string;
  /** Card "spoglia": solo nota, niente badge/normo/foot. */
  bare?: boolean;
  /** Sigillo normo.AI. */
  normo?: NormoSeal;
  /** Fonti cliccabili da cui nasce il task. */
  sources?: Source[];
  thread?: ThreadNote[];
}

/** Card-azione a runtime, arricchita dello stato di board. */
export interface FaroAction extends SeedAction {
  assignee: Actor | null;
  phase: Phase;
  doneMsg: string | null;
}

/** Messaggio della chat con Faro (o di normo.AI). */
export interface ChatMessage {
  role: "faro" | "me" | "normo";
  text: string;
  /** Risposte rapide proposte da Faro. */
  quick?: string[];
}

/** Contenuto di una bolla Faro (senza il ruolo). */
export type FaroBubble = Omit<ChatMessage, "role"> & { role?: ChatMessage["role"] };

/** Metadati di una colonna-attore. */
export interface ColumnMeta {
  key: ColumnKey;
  label: string;
  role: string;
  initial: string;
  color: string;
  soft: string;
}

/** Notifica toast. */
export interface Toast {
  id: string;
  icon: IconName;
  color?: string;
  title: string;
  msg?: string;
}

/** Vista corrente dell'app. */
export type View = "board" | "value" | "upgrade" | "permessi";

/** Stato di un permesso per categoria di dati. */
export interface PermFlag {
  v: boolean;
  e: boolean;
}
/** Permessi di un attore: per ciascuna categoria. */
export type ActorPerms = Record<string, PermFlag>;
/** Permessi di tutti gli attori configurabili. */
export type PermsState = Record<"faro" | "comm", ActorPerms>;
