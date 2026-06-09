/** Pulsante "Conferma tutte le azioni" in cima alla colonna Faro (✦ via CSS). */
export default function ConfirmAllButton({ onClick }: { onClick: () => void }) {
  return (
    <button className="confirm-all" onClick={onClick}>
      Conferma tutte le azioni
    </button>
  );
}
