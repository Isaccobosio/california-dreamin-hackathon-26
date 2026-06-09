import Icon, { type IconName } from "../components/Icon";

interface Props {
  onHome: () => void;
  onUpgrade: () => void;
}

/** Card-eroe in alto (KPI con bordo colorato). */
function Hero({ cls, icon, badge, badgeKind, value, label, bar }: { cls: string; icon: IconName; badge: string; badgeKind: "plan" | "delta"; value: string; label: string; bar?: number }) {
  return (
    <div className={`vc-hero ${cls}`}>
      <div className="vc-hero-top">
        <div className="vc-hero-ic">
          <Icon name={icon} size={20} />
        </div>
        {badgeKind === "plan" ? (
          <span className="vc-plan">{badge}</span>
        ) : (
          <span className="vc-delta">
            <Icon name="Trend" size={13} />
            {badge}
          </span>
        )}
      </div>
      <div className="vc-hero-val">{value}</div>
      <div className="vc-hero-lab">{label}</div>
      {bar != null && (
        <div className="vc-hero-bar">
          <i style={{ width: `${bar}%` }} />
        </div>
      )}
    </div>
  );
}

/** Riga di breakdown con barra proporzionale. */
function Bar({ label, n, pct, color }: { label: string; n: string; pct: number; color: string }) {
  return (
    <div className="vc-brk-row">
      <div className="vc-brk-head">
        <span>{label}</span>
        <b>{n}</b>
      </div>
      <div className="vc-brk-track">
        <i style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}

/** My Value Center: valore generato da Faro nel mese. */
export default function ValueCenter({ onHome, onUpgrade }: Props) {
  const months = [38, 52, 47, 61, 70, 86];
  const labels = ["Gen", "Feb", "Mar", "Apr", "Mag", "Giu"];

  return (
    <div className="vc">
      <div className="vc-crumb">
        <button onClick={onHome}>Home</button>
        <Icon name="Arrow" size={14} />
        <span>My Value Center</span>
      </div>
      <div className="vc-body">
        <div className="vc-titlewrap">
          <h1>My Value Center</h1>
          <p>Il valore che Faro ha generato per il tuo studio questo mese</p>
        </div>

        <div className="vc-heroes">
          <Hero cls="blue" icon="Clock" badge="+18%" badgeKind="delta" value="12h" label="Tempo risparmiato" />
          <Hero cls="viola" icon="Sparkle" badge="+25%" badgeKind="delta" value="847" label="Task automatizzati" />
          <Hero cls="orange" icon="Sparkle" badge="Piano Pro" badgeKind="plan" value="64%" label="Consumi AI" bar={64} />
          <Hero cls="green" icon="Trend" badge="+42%" badgeKind="delta" value="€ 2.450" label="ROI stimato" />
        </div>

        <div className="vc-grid">
          <div className="vc-panel">
            <div className="vc-panel-head">
              <div className="vc-panel-ic" style={{ background: "var(--faro-soft)", color: "var(--faro-strong)" }}>
                <Icon name="Sparkle" size={18} />
              </div>
              <div className="grow">
                <b>Consumi AI</b>
                <span>Azioni eseguite da Faro</span>
              </div>
              <span className="vc-tag">Piano Pro</span>
            </div>
            <div className="vc-meter">
              <div className="vc-meter-top">
                <div>
                  <span className="vc-big">1.280</span>
                  <span className="vc-of"> / 2.000 azioni AI</span>
                </div>
                <span className="vc-pct">64%</span>
              </div>
              <div className="vc-meter-track">
                <i style={{ width: "64%" }} />
              </div>
              <div className="vc-meter-foot">
                <Icon name="Repeat" size={13} />
                Si rinnova il 1° luglio · 720 azioni residue
              </div>
            </div>
            <div className="vc-brk">
              <Bar label="Solleciti inviati" n="420" pct={33} color="var(--faro)" />
              <Bar label="Fatture allo SDI" n="380" pct={30} color="var(--ink)" />
              <Bar label="Riconciliazioni bancarie" n="280" pct={22} color="var(--brand)" />
              <Bar label="Conferme ricorrenti" n="120" pct={9} color="var(--comm)" />
              <Bar label="Altre azioni" n="80" pct={6} color="var(--ink-4)" />
            </div>
            <button className="vc-cta" onClick={onUpgrade}>
              Effettua upgrade
              <Icon name="ArrowUR" size={14} />
            </button>
          </div>

          <div className="vc-side">
            <div className="vc-panel">
              <div className="vc-panel-head">
                <div className="vc-panel-ic" style={{ background: "var(--brand-soft)", color: "var(--brand-strong)" }}>
                  <Icon name="Chart" size={18} />
                </div>
                <div className="grow">
                  <b>Andamento consumi</b>
                  <span>Ultimi 6 mesi</span>
                </div>
              </div>
              <div className="vc-chart">
                {months.map((h, i) => (
                  <div key={i} className={`vc-col${i === 5 ? " on" : ""}`}>
                    <i style={{ height: `${h}%` }} />
                  </div>
                ))}
              </div>
              <div className="vc-chart-x">
                {labels.map((m, i) => (
                  <span key={i} className={i === 5 ? "on" : ""}>
                    {m}
                  </span>
                ))}
              </div>
            </div>
            <div className="vc-valuebox">
              <div className="vc-vrow">
                <Icon name="Clock" size={15} />
                <span className="grow">Ore risparmiate</span>
                <b>12h</b>
              </div>
              <div className="vc-vrow">
                <Icon name="Sparkle" size={15} />
                <span className="grow">Avviate da Faro</span>
                <b>68%</b>
              </div>
              <div className="vc-vrow">
                <Icon name="Euro" size={15} />
                <span className="grow">ROI stimato</span>
                <b>€ 2.450</b>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
