/** Risposte conversazionali mock di Faro/normo per ciascun tipo di azione. */
import type { ChatMessage, FaroAction, SeedAction } from "../types";

/** Primo messaggio di Faro all'apertura della chat. */
export const INITIAL_MESSAGES: ChatMessage[] = [
  {
    role: "faro",
    text: "Ciao Mario 👋 Sono Faro. Ho già pre-assegnato ciò di cui sono sicuro: le mie azioni nella mia colonna, le pratiche fiscali a Luca. Su due ho un dubbio — le trovi in “Da assegnare”. Tutto parte da una fonte: tocca “Fonte” su una card per vedere da dove arriva.",
    quick: ["Cosa puoi fare tu?", "Da dove parto?"],
  },
];

/** Esito dell'esecuzione: messaggio in chat + riga "completata" sulla card. */
export function faroHandle(a: Pick<SeedAction, "kind" | "client" | "amount">): { done: string; text: string } {
  switch (a.kind) {
    case "sollecito":
      return { done: "Sollecito inviato a " + a.client + " ✓", text: "Ci penso io. Ho inviato il sollecito a " + a.client + " per " + a.amount + ". ✓" };
    case "sdi":
      return { done: "4 fatture trasmesse allo SDI ✓", text: "Trasmetto le 4 fatture allo SDI… ✓ Fatto, ora in elaborazione (" + a.amount + ")." };
    case "ricorrente":
      return { done: "Confermata e inviata ✓", text: "Confermo la ricorrente di " + a.client + " (" + a.amount + "): importi e bollo corretti. ✓" };
    case "riconcilia":
      return { done: "3 movimenti riconciliati ✓", text: "Ho abbinato i 3 movimenti agli incassi (" + a.amount + "). ✓ Tutto quadra." };
    case "incasso":
      return { done: "Incasso registrato ✓", text: "Registro l'incasso di " + a.client + " (" + a.amount + "). ✓ Fatto." };
    case "scartata":
      return { done: "Corretta e ritrasmessa ✓", text: "Corretto l'errore di data (cod. 00404) e ritrasmesso allo SDI. ✓" };
    case "f24":
      return { done: "Delega F24 predisposta ✓", text: "Predisposta la delega F24 per " + a.amount + ", addebito al 16/6. ✓" };
    case "fornitore":
      return { done: "Fattura fornitore approvata ✓", text: "Ho controllato la fattura di " + a.client + " (" + a.amount + "): importi e IVA corretti. Approvata. ✓" };
    default:
      return { done: "Fatto ✓", text: "Fatto ✓" };
  }
}

/** Spiegazione che Faro dà quando una card viene trascinata in chat. */
export function explainFaro(a: FaroAction): string {
  switch (a.kind) {
    case "sollecito":
      return "È un sollecito a " + a.client + " per " + a.amount + ", " + a.urgency.text + ". Posso scrivere io un'email cordiale e inviarla, poi alzare il tono se non paga.";
    case "sdi":
      return "Sono 4 fatture create ma non ancora trasmesse allo SDI (" + a.amount + "). Posso trasmetterle io in un'unica operazione e avvisarti a ogni cambio di stato.";
    case "ricorrente":
      return "È la fattura ricorrente di " + a.client + " (" + a.amount + "). Posso ricontrollarla, confermarla e inviarla.";
    case "riconcilia":
      return "Ci sono 3 movimenti bancari da abbinare alle fatture aperte (" + a.amount + "). Posso riconciliarli io in automatico.";
    case "incasso":
      return "È un incasso ricevuto da " + a.client + " (" + a.amount + "), già abbinabile a una fattura. Posso registrarlo io sul conto.";
    case "scartata":
      return "La fattura di " + a.client + " è stata scartata dallo SDI (cod. 00404). Posso correggere l'errore di data e ritrasmetterla.";
    case "f24":
      return "È un F24 di " + a.amount + " in scadenza il 16/6. Posso predisporre la delega di pagamento.";
    case "fornitore":
      return "È una fattura fornitore di " + a.client + " (" + a.amount + "). Posso controllarla e approvarla.";
    default:
      return "Posso occuparmene io.";
  }
}

/** Risposta del commercialista quando riceve una nota. */
export function lucaReply(a: Pick<SeedAction, "kind">): string {
  switch (a.kind) {
    case "f24":
      return "Ricevuto, verifico l'F24 e ti confermo entro oggi.";
    case "scartata":
      return "Ok, correggo la data e ti aggiorno dopo la ritrasmissione.";
    default:
      return "Ricevuto, ci penso io e ti aggiorno a breve.";
  }
}

/** Risposta di normo.AI a "Chiedi a normo.AI" (sigillo o escalation). */
export function askNormoReply(a: FaroAction): { role: "normo"; text: string; quick?: string[] } {
  return a.normo === "escalate"
    ? {
        role: "normo",
        text: "normo.AI: la fattura è stata scartata per un errore formale sulla data (cod. 00404). È una correzione che conviene far validare al commercialista prima di ritrasmettere.",
        quick: ["Passa a Luca", "Correggi comunque"],
      }
    : {
        role: "normo",
        text: "normo.AI: l'importo dell'F24 è corretto e conforme alla liquidazione IVA di maggio. Nessuna anomalia rilevata. ✓",
        quick: ["Perfetto"],
      };
}
