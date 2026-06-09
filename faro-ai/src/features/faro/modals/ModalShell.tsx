import type { CSSProperties, ReactNode } from "react";

interface Props {
  onClose: () => void;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}

/** Scrim + contenitore modale. La variante (wide/detail/thread/as) via className. */
export default function ModalShell({ onClose, className, style, children }: Props) {
  return (
    <div
      className="modal-scrim"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className={`modal${className ? ` ${className}` : ""}`} style={style}>
        {children}
      </div>
    </div>
  );
}
