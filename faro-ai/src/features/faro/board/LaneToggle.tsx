interface Props {
  on: boolean;
  count: number;
  onToggle: () => void;
}

/** Toggle "Nascondi azioni completate" per colonna. */
export default function LaneToggle({ on, count, onToggle }: Props) {
  return (
    <div className="lane-toggle">
      <button className={`ltgl${on ? " on" : ""}`} onClick={onToggle}>
        <span className="sw">
          <i />
        </span>
        Nascondi azioni completate
        <span className="lt-cnt">{count}</span>
      </button>
    </div>
  );
}
