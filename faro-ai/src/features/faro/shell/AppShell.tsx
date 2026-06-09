import type { ReactNode } from "react";
import TopBar from "./TopBar";
import SideRail from "./SideRail";
import ContextHeader from "./ContextHeader";
import type { View } from "../types";

interface Props {
  view: View;
  setView: (v: View) => void;
  headerRight?: ReactNode;
  children: ReactNode;
}

/** Cornice TeamSystem: topbar + rail + sotto-header Faro; i contenuti sono i figli. */
export default function AppShell({ view, setView, headerRight, children }: Props) {
  return (
    <div className="faro">
      <TopBar view={view} setView={setView} />
      <div className="ts-main">
        <SideRail view={view} setView={setView} />
        <div className="ts-content">
          <ContextHeader right={headerRight} />
          {children}
        </div>
      </div>
    </div>
  );
}
