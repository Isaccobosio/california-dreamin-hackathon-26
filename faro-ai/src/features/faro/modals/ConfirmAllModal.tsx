import Icon from "../components/Icon";
import ModalShell from "./ModalShell";

interface Props {
  count: number;
  onCancel: () => void;
  onConfirm: () => void;
}

/** Conferma esecuzione in blocco delle azioni in colonna Faro. */
export default function ConfirmAllModal({ count, onCancel, onConfirm }: Props) {
  return (
    <ModalShell onClose={onCancel}>
      <div className="modal-ic">
        <Icon name="Sparkle" size={24} />
      </div>
      <h3>Sei sicuro di automatizzare queste azioni ({count})?</h3>
      <p>Faro eseguirà in autonomia le {count} azioni nella sua colonna — solleciti, invii allo SDI e riconciliazioni. Vedrai ogni passaggio nella chat.</p>
      <div className="modal-foot">
        <button className="btn ghost" onClick={onCancel}>
          Annulla
        </button>
        <button className="btn faro" onClick={onConfirm}>
          <Icon name="Sparkle" size={15} />
          Sì, automatizza
        </button>
      </div>
    </ModalShell>
  );
}
