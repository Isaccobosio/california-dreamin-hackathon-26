/**
 * Tipi del dominio Faro.
 * Tutto mockato lato UI: nessuna azione raggiunge un backend.
 */

/** Tipo di azione (kind) — guida icona, CTA e comportamento di Faro. */
export type ActionKind =
  | "sollecito"
  | "sdi"
  | "riconcilia"
  | "ricorrente"
  | "incasso"
  | "scartata"
  | "f24"
  | "passiva";

/** Tipo di fonte da cui nasce un task (popover "da dove arriva", spec §5). */
export type SourceKind = "fic" | "email" | "whatsapp" | "banca" | "calendario" | "regola" | "normo";

/** Una fonte cliccabile collegata a una card. */
export interface Source {
  kind: SourceKind;
  /** Etichetta breve della fonte (es. "Fatture in Cloud"). */
  label: string;
  /** Dettaglio concreto (es. "Fattura #2026/138, scaduta il 2/5"). */
  detail: string;
  /** Link opzionale "vai alla fonte". */
  href?: string;
}

/** Livello di urgenza: r = alto (rosso), a = medio (ambra), g = basso (verde). */
export type UrgencyLevel = "r" | "a" | "g";

/** Attori = colonne assegnabili della board. */
export type Actor = "me" | "comm" | "faro";

/** Chiavi colonna: gli attori + l'inbox "Da assegnare". */
export type ColumnKey = "inbox" | Actor;

/**
 * Fase di una card.
 * todo = da fare · work = Faro in lavorazione · ask = in attesa conferma in chat
 * done = completata · taken = presa in carico dal commercialista
 */
export type Phase = "todo" | "work" | "ask" | "done" | "taken" | null;

/** Varianti tag della chip (mappate sul tema Vapor). */
export type TagVariant = "error" | "default" | "violet" | "warning" | "success";

export interface Urgency {
  text: string;
  level: UrgencyLevel;
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
  title: string;
  client: string;
  sub: string;
  amount: string;
  tag: [string, TagVariant];
  urgency: Urgency;
  /** Attore pre-assegnato da Faro; null = incerto → inbox "Da assegnare". */
  suggest: Actor | null;
  /** Data fattura, usata nell'anteprima del sollecito. */
  fdate?: string;
  /** Nasconde la chip del tag. */
  bare?: boolean;
  /** Sigillo normo.AI. */
  normo?: "verified";
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

/** Messaggio della chat con Faro. */
export interface ChatMessage {
  role: "faro" | "me";
  text: string;
  /** Risposte rapide proposte da Faro. */
  quick?: string[];
}

/** Contenuto di una bolla Faro (senza il ruolo, sempre "faro"). */
export type FaroBubble = Omit<ChatMessage, "role">;

/** Metadati di una colonna-attore. */
export interface ColumnMeta {
  key: ColumnKey;
  label: string;
  role: string;
  initial: string;
  color: string;
}

/** Notifica toast. */
export interface Toast {
  title: string;
  msg?: string;
}

/** Vista corrente dell'app. */
export type View = "board" | "value" | "upgrade" | "permessi";
