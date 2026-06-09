import Icon from "../components/Icon";
import type { Dnd } from "../hooks/useFaroBoard";

interface Props {
  onOpen: () => void;
  dnd: Dnd;
}

/** Rail compatto quando la chat è chiusa; anche drop target verso Faro. */
export default function FaroRail({ onOpen, dnd }: Props) {
  return (
    <div
      className={`faro-rail${dnd.over === "faro-rail" ? " drop-on" : ""}`}
      onDragOver={(e) => dnd.allowDrop(e, "faro-rail")}
      onDragLeave={() => dnd.leave("faro-rail")}
      onDrop={(e) => dnd.onDrop(e, "faro-chat")}
    >
      <button className="rbtn" title="Apri il pannello Faro" onClick={onOpen}>
        <Icon name="Panel" size={20} />
      </button>
    </div>
  );
}
