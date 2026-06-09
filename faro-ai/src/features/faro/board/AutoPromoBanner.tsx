import Icon from "../components/Icon";

interface Props {
  onYes: () => void;
  onNo: () => void;
}

/** Riquadro di auto-promozione: Faro propone di inviare i solleciti da solo. */
export default function AutoPromoBanner({ onYes, onNo }: Props) {
  return (
    <div className="autopromo">
      <div className="ap-head">
        <div className="ap-ic">
          <Icon name="Sparkle" size={15} />
        </div>
        <b>Faro propone un'automazione</b>
      </div>
      <p>Acme paga sempre in ritardo e confermi sempre il sollecito. Vuoi che lo invii da solo, senza chiedertelo?</p>
      <div className="ap-btns">
        <button className="ap-yes" onClick={onYes}>
          Automatizza i solleciti
        </button>
        <button className="ap-no" onClick={onNo}>
          No, chiedimi sempre
        </button>
      </div>
    </div>
  );
}
