/** Logica e cataloghi di dominio (nessuna dipendenza UI). Fonte: faro-design-v2. */
import type { IconName } from "../components/Icon";
import type { FaroAction, SourceKind } from "../types";

/** Catalogo fonti: icona, colore, etichetta per ciascun tipo. */
export const SRC: Record<SourceKind, { icon: IconName; color: string; label: string }> = {
  fic: { icon: "Doc", color: "var(--brand)", label: "Fatture in Cloud" },
  email: { icon: "Send", color: "#D9480F", label: "Email" },
  whatsapp: { icon: "Phone", color: "#1FA855", label: "WhatsApp" },
  banca: { icon: "Bank", color: "var(--comm)", label: "Banca" },
  calendario: { icon: "Cal", color: "#7048E8", label: "Calendario" },
  regola: { icon: "Repeat", color: "var(--ink-2)", label: "Regola / schema" },
  normo: { icon: "Stamp", color: "#B4690E", label: "normo.AI" },
};

/** Attori configurabili nei permessi. */
export const ACTORS = {
  faro: {
    label: "Faro (AI)", role: "Assistente · agisce per te", init: "✦",
    color: "var(--faro)", soft: "var(--faro-soft)", strong: "var(--faro-strong)",
    icon: "Sparkle" as IconName,
    note: "Faro può vedere e agire solo dove gli dai il permesso. Ciò che non può modificare, lo prepara e te lo propone.",
  },
  comm: {
    label: "Commercialista", role: "Luca Ferri · studio esterno", init: "LF",
    color: "var(--comm)", soft: "var(--comm-soft)", strong: "var(--comm-strong)",
    icon: "Building" as IconName,
    note: "Luca è un professionista esterno: di norma accede in lettura ai dati e modifica solo gli adempimenti fiscali di sua competenza.",
  },
} as const;

export type PermActor = keyof typeof ACTORS;

/** Categorie di dati su cui si concedono i permessi. */
export const PERM_CATS: { id: string; icon: IconName; label: string; desc: string }[] = [
  { id: "fatture", icon: "Doc", label: "Fatture e corrispettivi", desc: "Fatture emesse e ricevute, note di credito" },
  { id: "clienti", icon: "Users", label: "Clienti e anagrafiche", desc: "Contatti, dati fiscali, condizioni di pagamento" },
  { id: "banca", icon: "Bank", label: "Conti e movimenti bancari", desc: "Saldi, bonifici, riconciliazioni" },
  { id: "fisco", icon: "Stamp", label: "Adempimenti fiscali", desc: "F24, liquidazioni IVA, dichiarazioni" },
  { id: "incassi", icon: "Money", label: "Incassi e pagamenti", desc: "Registrazione incassi, scadenzario" },
  { id: "prodotti", icon: "Box", label: "Prodotti e magazzino", desc: "Listini, giacenze, anagrafica prodotti" },
  { id: "analisi", icon: "Chart", label: "Analisi e report", desc: "Andamento, statistiche, indicatori" },
];

/** Permessi di default (v = visualizza, e = modifica). */
export const DEFAULT_PERMS = {
  faro: { fatture: { v: true, e: true }, clienti: { v: true, e: false }, banca: { v: true, e: true }, fisco: { v: true, e: false }, incassi: { v: true, e: true }, prodotti: { v: true, e: false }, analisi: { v: true, e: true } },
  comm: { fatture: { v: true, e: true }, clienti: { v: true, e: false }, banca: { v: true, e: false }, fisco: { v: true, e: true }, incassi: { v: true, e: false }, prodotti: { v: false, e: false }, analisi: { v: true, e: false } },
};

/** Artefatto mostrato in anteprima prima della conferma (testo modificabile). */
export type Artifact =
  | { kind: "email"; title: string; subtitle: string; num: string; date: string; subject: string; recipients: { name: string; email: string }[]; body: string }
  | { kind: "doc"; title: string; subtitle: string; text: string };

export function artifact(a: FaroAction): Artifact {
  if (a.kind === "sollecito") {
    const num = a.sub.split("·")[1]?.trim() ?? a.sub;
    return {
      kind: "email", title: "Anteprima sollecito", subtitle: `${a.client} · ${a.amount}`, num, date: a.fdate || "—",
      subject: `Sollecito di pagamento — Fattura ${num}`,
      recipients: [{ name: a.client, email: `amministrazione@${a.client.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 16)}.it` }],
      body: `Gentile ${a.client},\nLe ricordiamo che la fattura di ${a.amount} risulta ${a.urgency.text}. La invitiamo cordialmente a procedere con il pagamento.\nSe ha già provveduto, ignori questa email.\n\nCordiali saluti,\nMario Rossi`,
    };
  }
  if (a.kind === "ricorrente")
    return {
      kind: "doc", title: "Anteprima fattura ricorrente", subtitle: `${a.client} · ${a.amount}`,
      text: `Fattura ricorrente — ${a.client}\nDescrizione: Canone mensile hosting e manutenzione\nImponibile: € 400,00 · Bollo: assolto\nTotale: ${a.amount}\nScadenza: 30 gg data fattura`,
    };
  if (a.kind === "sdi")
    return {
      kind: "doc", title: "Anteprima invio allo SDI", subtitle: `4 fatture · ${a.amount}`,
      text: "4 fatture pronte per il Sistema di Interscambio:\n• 2026/151 — Galleria Moderna — € 2.196\n• 2026/152 — Acme S.r.l. — € 1.220\n• 2026/153 — Studio Bianchi — € 1.464\n• 2026/154 — Verdi Forniture — € 1.360\n" + `Totale: ${a.amount}`,
    };
  return { kind: "doc", title: "Anteprima", subtitle: a.client, text: a.title };
}

/** Formatta un importo in euro all'italiana. */
export const fmt = (n: number) => "€ " + Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
