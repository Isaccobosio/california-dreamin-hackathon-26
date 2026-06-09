import type { ReactNode } from "react";
import SideRail from "./SideRail";
import ContextHeader from "./ContextHeader";
import type { View } from "../types";

interface Props {
  view: View;
  setView: (v: View) => void;
  headerRight?: ReactNode;
  children: ReactNode;
}

/** Cornice Faro: rail + header bianco con navigazione; i contenuti sono i figli.
    La topbar globale scura è gestita dal servizio host, non qui. */
export default function AppShell({ view, setView, headerRight, children }: Props) {
  return (
    <div className="faro">
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
