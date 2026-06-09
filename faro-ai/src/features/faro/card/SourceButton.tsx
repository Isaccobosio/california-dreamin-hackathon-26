import Icon from "../components/Icon";
import type { Source } from "../types";

interface Props {
  sources?: Source[];
  onOpen: (rect: DOMRect) => void;
}

/** Pulsante "Fonte/N fonti" che apre il popover "da dove arriva". */
export default function SourceButton({ sources, onOpen }: Props) {
  const label = sources && sources.length > 1 ? `${sources.length} fonti` : "Fonte";
  return (
    <button
      className="srcbtn"
      onClick={(e) => {
        e.stopPropagation();
        onOpen(e.currentTarget.getBoundingClientRect());
      }}
    >
      <Icon name="Search" size={13} />
      {label}
    </button>
  );
}
