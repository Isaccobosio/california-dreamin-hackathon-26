/** Dati mock dello scenario a schermo (fonte: faro-design-v2). */
import type { ActionKind, ColumnKey, ColumnMeta, SeedAction } from "../types";

/** Attori (colonne) della board. */
export const COLS: Record<ColumnKey, ColumnMeta> = {
  inbox: { key: "inbox", label: "Da assegnare", role: "Faro è incerto a chi darle", initial: "?", color: "var(--faro)", soft: "var(--faro-soft)" },
  me: { key: "me", label: "Mario Rossi", role: "Tu · titolare", initial: "MR", color: "var(--brand)", soft: "var(--brand-soft)" },
  faro: { key: "faro", label: "Faro (AI)", role: "Assistente · agisce per te", initial: "✦", color: "var(--faro)", soft: "var(--faro-soft)" },
  comm: { key: "comm", label: "Commercialista", role: "Luca Ferri · studio", initial: "LF", color: "var(--comm)", soft: "var(--comm-soft)" },
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
  fornitore: "Vai ad approvare",
};

/** Tipi che richiedono un'anteprima prima dell'esecuzione di Faro. */
export const NEEDS_PREVIEW: ActionKind[] = ["sollecito", "ricorrente", "sdi"];

/** urgency.level: r alto · a medio · g basso · rank: minore = più urgente. */
export const SEED: SeedAction[] = [
  {
    id: "a1", kind: "sollecito", icon: "Send", kic: "r", title: "Sollecita fattura scaduta", sub: "Acme S.r.l. · 2026/138", amount: "€ 8.784", val: 8784,
    tag: ["SCADUTA", "r"], client: "Acme S.r.l.", suggest: "faro", autopromo: true, fdate: "02/04/2026",
    urgency: { text: "scaduta da 37 gg", level: "r", rank: -37 },
    sources: [
      { kind: "fic", detail: "Fattura #2026/138, scaduta il 2/5", link: "Apri in FIC" },
      { kind: "regola", detail: "Schema: Acme paga a ~60 gg, sempre in ritardo", link: "Gestisci regola" },
    ],
  },
  {
    id: "a2", kind: "sollecito", icon: "Send", kic: "r", title: "Sollecita fattura scaduta", sub: "Studio Bianchi & Partners · 2026/142", amount: "€ 3.660", val: 3660,
    tag: ["SCADUTA", "r"], client: "Studio Bianchi", suggest: "faro", fdate: "14/05/2026",
    urgency: { text: "scaduta da 25 gg", level: "r", rank: -25 },
    sources: [
      { kind: "fic", detail: "Fattura #2026/142, scaduta il 14/5", link: "Apri in FIC" },
      { kind: "whatsapp", detail: "Bianchi, 3/6: «arriva a breve»", link: "Apri chat" },
    ],
  },
  {
    id: "a7", kind: "scartata", icon: "Pencil", kic: "r", title: "Correggi fattura scartata SDI", sub: "Verdi Forniture · errore cod. 00404", amount: "€ 1.342", val: 1342,
    tag: ["SCARTATA SDI", "d"], client: "Verdi Forniture", suggest: "comm",
    urgency: { text: "scartata ieri", level: "r", rank: -1 },
    sources: [
      { kind: "fic", detail: "Ricevuta di scarto SDI, cod. 00404 — ieri", link: "Apri ricevuta" },
      { kind: "normo", detail: "normo.AI: errore formale sulla data, serve il commercialista", link: "Chiedi a normo.AI" },
    ],
    normo: "escalate",
  },
  {
    id: "a3", kind: "sdi", icon: "Doc", kic: "d", title: "Invia 4 fatture allo SDI", sub: "Create ma non trasmesse", amount: "€ 6.240", val: 6240,
    tag: ["DA INVIARE · SDI", "d"], client: "4 fatture", suggest: "faro",
    urgency: { text: "create ieri, da inviare oggi", level: "a", rank: 0 },
    sources: [{ kind: "fic", detail: "4 fatture create il 6/6, non ancora trasmesse", link: "Apri in FIC" }],
  },
  {
    id: "a5", kind: "riconcilia", icon: "Bank", kic: "b", title: "Riconcilia 3 movimenti banca", sub: "Incassi da abbinare", amount: "€ 5.420", val: 5420,
    tag: ["DA RICONCILIARE", "d"], client: "3 movimenti", suggest: "faro",
    urgency: { text: "bonifici di ieri", level: "a", rank: 1 },
    chain: "Bonifici (banca) + fatture aperte (FIC) → incassi da riconciliare",
    sources: [
      { kind: "banca", detail: "3 bonifici ricevuti il 5/6 (€ 5.420)", link: "Vedi movimenti" },
      { kind: "fic", detail: "Corrispondono a fatture aperte", link: "Apri in FIC" },
    ],
  },
  {
    id: "a4", kind: "ricorrente", icon: "Repeat", kic: "f", title: "Conferma fattura ricorrente", sub: "Canone hosting · Galleria Moderna", amount: "€ 400", val: 400,
    tag: ["DA CONFERMARE", "f"], client: "Galleria Moderna", suggest: null, doubt: "La confermo io o la vedi prima tu?",
    urgency: { text: "si genera tra 3 gg", level: "a", rank: 3 },
    sources: [
      { kind: "regola", detail: "Regola: canone mensile Galleria Moderna", link: "Gestisci regola" },
      { kind: "calendario", detail: "Si attiva l'11/6", link: "Apri scadenzario" },
    ],
  },
  {
    id: "a9", kind: "fornitore", icon: "Cart", kic: "d", title: "Approva fattura fornitore", sub: "Acme Forniture · costi di studio", amount: "€ 980", val: 980,
    tag: ["DA APPROVARE", "d"], client: "Acme Forniture", suggest: null, doubt: "La registro io o la controlli prima tu?",
    urgency: { text: "ricevuta 2 gg fa", level: "a", rank: 2 },
    sources: [
      { kind: "fic", detail: "Fattura fornitore ricevuta via SDI il 6/6", link: "Apri in FIC" },
      { kind: "email", detail: "Allegato PDF da acme@forniture.it", link: "Apri email" },
    ],
  },
  {
    id: "a8", kind: "f24", icon: "Euro", kic: "a", title: "Paga F24 · IVA mensile", sub: "Liquidazione IVA di maggio", amount: "€ 1.487", val: 1487,
    tag: ["F24", "a"], client: "F24 IVA", suggest: "comm", normo: "verified",
    urgency: { text: "scade tra 8 gg", level: "a", rank: 8 },
    thread: [{ author: "luca", name: "Luca Ferri", text: "Ho ricevuto l'F24, lo verifico e ti confermo entro oggi.", time: "2 h fa" }],
    sources: [
      { kind: "fic", detail: "Liquidazione IVA maggio", link: "Apri in FIC" },
      { kind: "calendario", detail: "Scadenza 16/6", link: "Apri scadenzario" },
      { kind: "normo", detail: "normo.AI: importo verificato, conforme", link: "Chiedi a normo.AI" },
    ],
  },
  {
    id: "a6", kind: "incasso", icon: "Money", kic: "g", title: "Registra incasso ricevuto", sub: "Galleria Moderna · bonifico", amount: "€ 2.196", val: 2196,
    tag: ["INCASSO RICEVUTO", "g"], client: "Galleria Moderna", suggest: "me",
    urgency: { text: "incassato ieri", level: "g", rank: 2 },
    chain: "Bonifico (banca) + fattura #2026/149 (FIC) → incasso confermato",
    sources: [
      { kind: "banca", detail: "Bonifico € 2.196 ricevuto il 5/6", link: "Vedi movimento" },
      { kind: "fic", detail: "Abbinabile a fattura #2026/149", link: "Apri in FIC" },
    ],
  },
];
