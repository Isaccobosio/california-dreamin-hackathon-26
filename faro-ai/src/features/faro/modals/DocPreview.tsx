import { useState } from "react";
import Icon from "../components/Icon";
import ModalShell from "./ModalShell";
import type { Artifact } from "../data/domain";

type DocArt = Extract<Artifact, { kind: "doc" }>;

interface Props {
  art: DocArt;
  onCancel: () => void;
  onConfirm: (edited: boolean) => void;
}

/** Anteprima documento (ricorrente / invio SDI) con modifica testo. */
export default function DocPreview({ art, onCancel, onConfirm }: Props) {
  const [edit, setEdit] = useState(false);
  const [text, setText] = useState(art.text);

  return (
    <ModalShell onClose={onCancel} className="wide">
      <div className="pv-head">
        <div className="modal-ic sm" style={{ boxShadow: "none" }}>
          <Icon name="Doc" size={18} />
        </div>
        <div className="grow">
          <h3>{art.title}</h3>
          <div className="pv-sub">{art.subtitle}</div>
        </div>
        <span className="pv-badge">
          <Icon name="Sparkle" size={12} />
          preparato da Faro
        </span>
      </div>
      <div className="pv-body">
        {edit ? (
          <textarea className="pv-text" value={text} onChange={(e) => setText(e.target.value)} autoFocus />
        ) : (
          <pre className="pv-doc">{text}</pre>
        )}
      </div>
      <div className="modal-foot">
        <button className="btn ghost" onClick={onCancel}>
          Annulla
        </button>
        <button className="btn light" onClick={() => setEdit((v) => !v)}>
          <Icon name="Pencil" size={14} />
          {edit ? "Fine modifica" : "Modifica"}
        </button>
        <button className="btn faro" onClick={() => onConfirm(edit && text !== art.text)}>
          <Icon name="Check" size={15} />
          Conferma
        </button>
      </div>
    </ModalShell>
  );
}
