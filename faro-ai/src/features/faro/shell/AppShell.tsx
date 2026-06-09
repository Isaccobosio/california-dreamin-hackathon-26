import { useLayoutEffect, useRef, type ReactNode } from "react";
import SideRail from "./SideRail";
import ContextHeader from "./ContextHeader";
import type { View } from "../types";

interface Props {
  view: View;
  setView: (v: View) => void;
  headerRight?: ReactNode;
  children: ReactNode;
}

/**
 * Cornice Faro: rail + header bianco con navigazione; i contenuti sono i figli.
 * La topbar globale (scura o bianca) è del servizio host, non nostra.
 *
 * In produzione l'app è montata SOTTO la topbar dell'host: un'altezza fissa
 * `100vh` sfora di quanto è alta quella barra e fa scrollare tutto. Non
 * conoscendo la sua dimensione, calcoliamo l'altezza disponibile dal nostro
 * offset reale (innerHeight − top) e la teniamo aggiornata su resize / cambi
 * di layout dell'host.
 */
export default function AppShell({ view, setView, headerRight, children }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fit = () => {
      const top = el.getBoundingClientRect().top;
      el.style.height = `${Math.max(0, window.innerHeight - top)}px`;
    };
    fit();
    window.addEventListener("resize", fit);
    // La chrome dell'host può comparire o ridimensionarsi dopo il mount:
    // osservare il body coglie i cambi di layout che spostano il nostro top.
    const ro = new ResizeObserver(fit);
    ro.observe(document.body);
    const settle = window.setTimeout(fit, 200);
    return () => {
      window.removeEventListener("resize", fit);
      ro.disconnect();
      window.clearTimeout(settle);
    };
  }, []);

  return (
    <div className="faro" ref={ref}>
      <div className="ts-main">
        <SideRail />
        <div className="ts-content">
          <ContextHeader view={view} setView={setView} right={headerRight} />
          {children}
        </div>
      </div>
    </div>
  );
}
