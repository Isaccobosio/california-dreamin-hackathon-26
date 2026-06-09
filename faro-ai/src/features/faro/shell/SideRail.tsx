import Icon, { type IconName } from "../components/Icon";
import type { View } from "../types";

interface Props {
  view: View;
  setView: (v: View) => void;
}

const ITEMS: { icon: IconName; title: string; target: View; activeOn: View[] }[] = [
  { icon: "Sparkle", title: "Faro", target: "board", activeOn: ["board"] },
  { icon: "Doc", title: "Documenti", target: "board", activeOn: [] },
  { icon: "Trend", title: "Analisi", target: "value", activeOn: ["value", "upgrade"] },
];

/** Rail verticale scuro a sinistra. */
export default function SideRail({ view, setView }: Props) {
  return (
    <div className="ts-rail">
      {ITEMS.map((it, i) => (
        <button key={i} className={`ts-rail-ic${it.activeOn.includes(view) ? " on" : ""}`} title={it.title} onClick={() => setView(it.target)}>
          <Icon name={it.icon} size={20} />
        </button>
      ))}
    </div>
  );
}
