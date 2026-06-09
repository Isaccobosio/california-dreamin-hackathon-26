import Icon, { type IconName } from "../components/Icon";

/**
 * Rail verticale (chrome TeamSystem). Le icone sono placeholder NON cliccabili:
 * rappresentano altre capability fuori scope. La navigazione Faro vive
 * nell'header bianco, non qui. Faro è l'unica voce attiva (vista corrente).
 */
const ITEMS: { icon: IconName; title: string; active?: boolean }[] = [
  { icon: "Sparkle", title: "Faro", active: true },
  { icon: "Doc", title: "Documenti" },
  { icon: "Chart", title: "Analisi" },
  { icon: "Cal", title: "Scadenzario" },
  { icon: "Gear", title: "Impostazioni" },
];

export default function SideRail() {
  return (
    <div className="ts-rail">
      {ITEMS.map((it, i) => (
        <div key={i} className={`ts-rail-ic${it.active ? " on" : ""}`} title={it.title} aria-disabled>
          <Icon name={it.icon} size={20} />
        </div>
      ))}
    </div>
  );
}
