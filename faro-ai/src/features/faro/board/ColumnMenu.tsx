import { useState } from "react";
import Icon from "../components/Icon";

/** Menu "…" della colonna commercialista: nasconde la colonna. */
export default function ColumnMenu({ onHide }: { onHide: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="col-more">
      <button className="col-more-btn" title="Opzioni colonna" onClick={() => setOpen((v) => !v)}>
        <Icon name="Dots" size={16} />
      </button>
      {open && <div className="col-menu-back" onMouseDown={() => setOpen(false)} />}
      {open && (
        <div className="col-menu">
          <button
            onClick={() => {
              setOpen(false);
              onHide();
            }}
          >
            <Icon name="Eye" size={14} />
            Non visualizzare questa colonna
          </button>
        </div>
      )}
    </div>
  );
}
