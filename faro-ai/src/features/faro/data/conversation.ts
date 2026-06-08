/** Risposte conversazionali mock di Faro per ciascun tipo di azione. */
import type { FaroAction, SeedAction } from "../types";

/** Esito dell'esecuzione: messaggio in chat + riga "completata" sulla card. */
export function faroHandle(a: Pick<SeedAction, "kind" | "client" | "amount">): { done: string; text: string } {
  switch (a.kind) {
    case "sollecito":
      return { done: "Sollecito inviato a " + a.client + " ✓", text: "Ci penso io: ho scritto un sollecito cordiale a " + a.client + " per " + a.amount + " e l'ho inviato. ✓" };
    case "sdi":
      return { done: "4 fatture trasmesse allo SDI ✓", text: "Trasmetto le 4 fatture allo SDI… ✓ Ora sono in elaborazione (" + a.amount + ")." };
    case "ricorrente":
      return { done: "Confermata e inviata ✓", text: "Ho ricontrollato la ricorrente di " + a.client + " (" + a.amount + "): importi e bollo corretti. Confermata e inviata. ✓" };
    case "riconcilia":
      return { done: "3 movimenti riconciliati ✓", text: "Ho abbinato i 3 movimenti bancari agli incassi (" + a.amount + "). ✓ Tutto quadra." };
    case "incasso":
      return { done: "Incasso registrato ✓", text: "Registro l'incasso di " + a.client + " (" + a.amount + ") sul conto. ✓" };
    case "scartata":
      return { done: "Corretta e ritrasmessa ✓", text: "Era un errore di data (cod. 00404). Corretta e ritrasmessa allo SDI. ✓" };
    case "f24":
      return { done: "Delega F24 predisposta ✓", text: "Ho predisposto la delega F24 per " + a.amount + " con addebito al 16 giugno. ✓" };
    case "passiva":
      return { done: "Fattura fornitore approvata ✓", text: "Ho controllato la fattura di " + a.client + " (" + a.amount + "): importi e IVA corretti. Approvata e registrata. ✓" };
    default:
      return { done: "Fatto ✓", text: "Fatto ✓" };
  }
}

/** Spiegazione che Faro dà quando una card viene trascinata in chat. */
export function explainFaro(a: FaroAction): string {
  switch (a.kind) {
    case "sollecito":
      return "È un sollecito a " + a.client + " per " + a.amount + ", " + a.urgency.text + ". Posso scrivere io l'email e inviarla.";
    case "sdi":
      return "Sono 4 fatture create ma non trasmesse allo SDI (" + a.amount + "). Posso trasmetterle io in un'unica operazione.";
    case "ricorrente":
      return "È la fattura ricorrente di " + a.client + " (" + a.amount + "). Posso ricontrollarla, confermarla e inviarla.";
    case "riconcilia":
      return "Ci sono 3 movimenti bancari da abbinare (" + a.amount + "). Posso riconciliarli io.";
    case "incasso":
      return "È un incasso da " + a.client + " (" + a.amount + "). Posso registrarlo io sul conto.";
    case "scartata":
      return "La fattura di " + a.client + " è stata scartata dallo SDI (cod. 00404). Posso correggere e ritrasmettere.";
    case "f24":
      return "È un F24 di " + a.amount + " in scadenza il 16/6. Posso predisporre la delega.";
    case "passiva":
      return "È una fattura fornitore di " + a.client + " (" + a.amount + "). Posso controllarla e approvarla.";
    default:
      return "Posso occuparmene io.";
  }
}
