import { useLayoutEffect, useRef, useState } from "react";
import Icon from "../components/Icon";
import { SRC } from "../data/domain";
import type { FaroAction } from "../types";

interface Props {
  a: FaroAction;
  rect: DOMRect;
  onClose: () => void;
}

/** Popover "Da dove arriva": catena di segnali + fonti cliccabili, posizionato sotto il pulsante. */
export default function SourcePopover({ a, rect, onClose }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState<React.CSSProperties>({ left: rect.left, top: rect.bottom + 6, visibility: "hidden" });

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const w = el.offsetWidth;
    const h = el.offsetHeight;
    const M = 12;
    let left = rect.left;
    if (left + w > window.innerWidth - M) left = rect.right - w;
    if (left + w > window.innerWidth - M) left = window.innerWidth - M - w;
    if (left < M) left = M;
    let top = rect.bottom + 6;
    if (top + h > window.innerHeight - M) {
      const above = rect.top - 6 - h;
      top = above >= M ? above : Math.max(M, window.innerHeight - M - h);
    }
    setStyle({ left, top, visibility: "visible" });
  }, [rect]);

  return (
    <div className="src-backdrop" onMouseDown={onClose}>
      <div className="src-pop" ref={ref} style={style} onMouseDown={(e) => e.stopPropagation()}>
        <div className="src-h">Da dove arriva</div>
        {a.chain && (
          <div className="src-chain">
            <Icon name="Sparkle" size={12} />
            {a.chain}
          </div>
        )}
        {(a.sources ?? []).map((s, i) => {
          const cfg = SRC[s.kind];
          return (
            <div key={i} className="src-row">
              <div className="src-ic" style={{ color: cfg.color, background: `color-mix(in srgb, ${cfg.color} 12%, #fff)` }}>
                <Icon name={cfg.icon} size={14} />
              </div>
              <div className="src-tx">
                <span className="src-lab" style={{ color: cfg.color }}>
                  {cfg.label}
                </span>
                <span className="src-det">{s.detail}</span>
              </div>
              {s.link && (
                <button className="src-link">
                  {s.link}
                  <Icon name="ArrowUR" size={12} />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
