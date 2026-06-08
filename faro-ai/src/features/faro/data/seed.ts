/** Dati mock dello scenario a schermo. */
import type { ActionKind, ColumnKey, ColumnMeta, SeedAction } from "../types";

/** Attori (colonne) della board. */
export const COLS: Record<ColumnKey, ColumnMeta> = {
  inbox: { key: "inbox", label: "Da assegnare", role: "Faro è incerto a chi darle", initial: "?", color: "var(--faro)" },
  me: { key: "me", label: "Mario Rossi", role: "Tu · titolare", initial: "MR", color: "#008FD6" },
  comm: { key: "comm", label: "Commercialista", role: "Luca Ferri · studio", initial: "LF", color: "#09822A" },
  faro: { key: "faro", label: "Faro (AI)", role: "Assistente · agisce per te", initial: "✦", color: "var(--faro)" },
};

/** Label del pulsante CTA quando l'azione è in colonna "Mario Rossi". */
export const CTA: Record<ActionKind, string> = {
  sollecito: "Vai a sollecitare",
  sdi: "Vai allo SDI",
  ricorrente: "Vai a confermare",
  riconcilia: "Vai a riconciliare",
  incasso: "Vai a incassare",
  scartata: "Vai a correggere",
  f24: "Vai a pagare l'F24",
};

/** urgency.level: r alto · a medio · g basso */
export const SEED: SeedAction[] = [
  { id: "a1", kind: "sollecito", title: "Sollecita fattura scaduta", client: "Rossi Costruzioni S.r.l.", sub: "Fattura 2026/138", amount: "€ 8.784", tag: ["SCADUTA 37g", "error"], urgency: { text: "scaduta da 37 gg", level: "r" }, suggest: "faro", fdate: "02/04/2026" },
  { id: "a2", kind: "sollecito", title: "Sollecita fattura scaduta", client: "Studio Bianchi & Partners", sub: "Fattura 2026/142", amount: "€ 3.660", tag: ["SCADUTA 25g", "error"], urgency: { text: "scaduta da 25 gg", level: "r" }, suggest: "faro", fdate: "14/05/2026" },
  { id: "a3", kind: "sdi", title: "Invia 4 fatture allo SDI", client: "4 fatture", sub: "Create ma non trasmesse", amount: "€ 6.240", tag: ["DA INVIARE · SDI", "default"], urgency: { text: "create 2 gg fa", level: "a" }, suggest: "faro" },
  { id: "a5", kind: "riconcilia", title: "Riconcilia 3 movimenti banca", client: "3 movimenti", sub: "Incassi da abbinare", amount: "€ 5.420", tag: ["DA RICONCILIARE", "default"], urgency: { text: "ricevuti ieri", level: "a" }, suggest: "faro" },
  { id: "a7", kind: "scartata", title: "Correggi fattura scartata SDI", client: "Verdi Forniture", sub: "Errore cod. 00404", amount: "€ 1.342", tag: ["SCARTATA SDI", "default"], urgency: { text: "scartata ieri", level: "r" }, suggest: "comm", bare: true },
  { id: "a8", kind: "f24", title: "Paga F24 · IVA mensile", client: "F24 IVA", sub: "Liquidazione IVA di maggio", amount: "€ 1.487", tag: ["F24", "warning"], urgency: { text: "scade tra 8 gg", level: "a" }, suggest: "comm", normo: "verified", thread: [{ author: "luca", name: "Luca Ferri", text: "Ho ricevuto l'F24, lo verifico e ti confermo entro oggi.", time: "2 h fa" }] },
  // incerte → da assegnare
  { id: "a4", kind: "ricorrente", title: "Conferma fattura ricorrente", client: "Galleria Moderna", sub: "Canone hosting mensile", amount: "€ 400", tag: ["DA CONFERMARE", "violet"], urgency: { text: "si attiva tra 3 gg", level: "a" }, suggest: null },
  { id: "a6", kind: "incasso", title: "Registra incasso ricevuto", client: "Galleria Moderna", sub: "Bonifico in entrata", amount: "€ 2.196", tag: ["INCASSO RICEVUTO", "success"], urgency: { text: "ricevuto oggi", level: "g" }, suggest: "me" },
];
