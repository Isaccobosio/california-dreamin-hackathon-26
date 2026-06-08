# Faro — Contesto del prototipo

> Documento di briefing per dare contesto a una conversazione che non conosce il progetto.
> Spiega **cos'è Faro, cosa fa il prototipo, e cosa è reale vs simulato**. Leggilo tutto prima di intervenire sul prototipo o di produrre materiali (demo, script, slide).

---

## 1. In una riga

**Faro** è un segretario AI proattivo che reinventa **Fatture in Cloud (FIC)**: trasforma un gestionale di fatturazione in un assistente che osserva, prepara e agisce al posto dell'utente. Il principio guida è **"da run software a run business"** — il software lavora per te, tu gestisci il business, non la fatturazione. È un prototipo per un hackathon TeamSystem; web app **desktop-first**.

---

## 2. Modello di prodotto (il "perché")

Quattro attori che si muovono nello stesso flusso:

- **Imprenditore** — micro-impresa/PMI. Prende le decisioni di business e l'approvazione finale.
- **Faro (segretario AI)** — osserva i segnali, prepara le azioni, le propone.
- **Commercialista** — attore attivo (non destinatario di email): decide dove serve competenza fiscale.
- **normo.AI** — prodotto esterno, *cervello normativo*. **Facoltativo**, interviene solo su giudizi di conformità o quando serve l'escalation. Doppio ruolo: sigillo di conformità + consulente on-demand.

**Loop:** segnale → Faro prepara → routing all'attore giusto → esecuzione tracciata.

**Routing (3 opzioni per ogni azione):** *chiedi a me* / *chiedi al commercialista* / *fai autonomamente*. Faro pre-assegna alla colonna dell'attore quando ha una regola o buona certezza; lascia in **"Da assegnare"** solo ciò di cui è incerto.

---

## 3. Cos'è il prototipo (tecnicamente)

- Export di **Claude Design**: una web app **React** (resa via Babel in-browser), un unico componente applicativo principale (`faro-app`).
- **Desktop-first**, layout a colonne con pannello chat laterale.
- Font **Manrope**; token di colore: `--brand` blu (#0E62E0), `--faro` viola (#6A4BF0), `--comm` verde (#0B8A6A), più neutri ink/grigi; normo.AI usa il rame **#B4690E**.
- I dati sono **seed statici** in memoria (vedi §6). Non c'è backend: ogni "azione" è simulata lato UI.

---

## 4. Schermata principale: la board "chi fa cosa"

La home è una **centrale operativa** organizzata come board con drag&drop:

- **Colonne-attore:** *Io* (blu), *Faro AI* (viola), *Commercialista* (verde).
- **Inbox "Da assegnare":** solo le card incerte; l'utente le assegna trascinandole.
- Ogni elemento è una **card-azione** (vedi §5).
- **Priorità:** le card sono ordinate per **imminenza** (urgenza espressa come tempo concreto, non come punteggio). In cima, una sintesi del tipo "oggi contano N cose".
- **Pannello chat Faro** (laterale): conversazione con il segretario; da qui si può anche interrogare **normo.AI**.
- **Confirm-all / "Automatizza tutte le azioni assegnate a Faro":** esegue in sequenza le azioni nella colonna di Faro (con modale di conferma e toast di avanzamento).

---

## 5. La card-azione (oggetto centrale)

Ogni card rappresenta una cosa da fare e porta:

- **Tipo** (`kind`): `sollecito`, `incasso`/riconciliazione, `sdi` (invio fatture allo SDI), `ricorrente`, `f24`, `scartata` (correggi fattura scartata SDI), fattura passiva da email, richiesta da WhatsApp.
- **Urgenza** come testo temporale: "scaduta da 37 gg", "scade tra 8 gg", "scartata ieri". Niente punteggi astratti.
- **Importo** in €.
- **Fonte cliccabile** (`sources`): da dove nasce il task. Tipi: **FIC** (dati interni), **email**, **WhatsApp**, **banca**, **calendario**, **regola/schema**, **normo.AI**. Al click si apre un popover "da dove arriva" con dettaglio concreto (es. "Fattura #2026/138, scaduta il 2/5") e link "vai alla fonte". Quando il task nasce da più segnali, mostra la catena (es. fattura FIC + bonifico in banca → incasso confermato).
- **Suggerimento di routing** (`suggest`) e **assegnazione** (`gest`): l'attore proposto/assegnato.
- **Sigillo normo.AI** (quando pertinente): "Verificato da normo.AI · conforme" oppure "Richiede valutazione normativa → commercialista".

---

## 6. Lo scenario a schermo (seed data)

Le card che compongono la demo (cliente, situazione):

- **Acme S.r.l.** — sollecito su fattura scaduta da 37 gg; ha lo **schema "paga a ~60 gg, sempre in ritardo"** → innesca l'auto-promozione (§7).
- **Studio Bianchi & Partners** — sollecito su fattura scaduta (€ 3.660).
- **Invia 4 fatture allo SDI** — create ma non trasmesse (€ 6.240: Galleria Moderna, Acme, Studio Bianchi, Verdi Forniture).
- **Liquidazione IVA / F24** — adempimento in scadenza; sigillo normo "Conforme alla norma"; assegnato/suggerito al **commercialista** (con thread del commercialista "Luca Ferri").
- **Registra incasso** — bonifico ricevuto da Galleria Moderna (€ 2.196).
- **Correggi fattura scartata SDI** — Verdi Forniture, codice di scarto 00404; normo segnala "richiede valutazione → commercialista".
- **Fattura passiva da email** — fornitore via SDI, allegato PDF.
- **Richiesta via WhatsApp** — un cliente che chiede la fattura.

---

## 7. Funzionalità chiave (cosa dimostra)

1. **Briefing / Priorità** — all'apertura, solo le cose che contano oggi, ordinate per urgenza.
2. **Routing & board** — assegnazione delle azioni ai tre attori, drag&drop, "Da assegnare" per gli incerti.
3. **Fonte cliccabile** — trasparenza su da dove nasce ogni task (vedi §5).
4. **Anteprima prima della conferma** — per sollecito, ricorrente/SDI ecc. l'utente vede l'artefatto (testo del sollecito, fattura) prima di confermare. Mai confermare senza vedere.
5. **Auto-promozione** — dopo che l'utente invia ripetutamente il sollecito ad **Acme** (che paga sempre in ritardo), Faro propone in modo visibile: *"Acme paga sempre in ritardo e confermi sempre il sollecito. Vuoi che lo invii da solo?"* → pulsanti **[Automatizza i solleciti] / [No, chiedimi sempre]**. Se si automatizza: compare il badge **"Automatico"** e i solleciti futuri partono da soli (stato `autoTypes`).
6. **normo.AI** — interviene solo su giudizi normativi: **sigillo di conformità** ("Conforme alla norma"), **escalation** ("Richiede valutazione → commercialista"), e **consulente on-demand** richiamabile **dalla chat** ("Chiedi a normo.AI") con risposta in bolla distinta (rame, icona timbro, etichetta "normo.AI") che cita le fonti in modo generico. normo **non** elabora documenti o numeri: valida regole, non aritmetica.
7. **Handoff al commercialista** — le decisioni a competenza fiscale vengono instradate al commercialista; la card cambia stato fino a "Risolto dal commercialista".
8. **Widget adoption** — indicatore con baseline 26% → valore con Faro (mock) e "% azioni avviate da Faro".
9. **Chat Faro** — assistente conversazionale; superficie da cui Faro propone azioni e da cui si consulta normo.AI.

---

## 8. Cosa è REALE e cosa è SIMULATO (leggere con attenzione)

- **Tutto il backend è simulato.** Nessuna azione parte davvero: nessun sollecito inviato, nessun invio SDI, nessun pagamento, nessuna lettura reale da FIC. Sono transizioni di stato lato UI su dati seed.
- **I connettori esterni** (email, WhatsApp, banca, calendario) sono **rappresentati come fonti**, non realmente integrati.
- **normo.AI** nel prototipo è inscenato dentro uno **scope volutamente prudente**: conformità, escalation, Q&A con citazione generica delle fonti. Le sue capability reali non sono confermate da fonte ufficiale; nel prototipo **non** fa diagnosi automatica di scarti SDI né verifica aritmetica di F24/IVA (quei dettagli tecnici sono attribuiti alla ricevuta SDI / a FIC, non a normo).
- **I dati** (clienti, importi, date) sono di esempio, non reali.
- Visione target: backend FIC in **sola lettura** previsto per la demo, scritture simulate.

---

## 9. Glossario rapido

- **Faro** = il segretario AI / il prodotto.
- **Run software → run business** = la trasformazione: smettere di operare il gestionale, iniziare a gestire il business.
- **normo.AI** = cervello normativo esterno, facoltativo.
- **Auto-promozione** = l'AI che, dopo conferme ripetute con esito positivo, propone di rendere autonoma un'azione.
- **Floor del commercialista** = decisioni che restano di competenza del commercialista, non declassabili dall'utente.
- **Da assegnare** = inbox delle sole card su cui Faro è incerto.
