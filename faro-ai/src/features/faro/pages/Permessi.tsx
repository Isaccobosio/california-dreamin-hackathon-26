import { useState } from "react";
import Icon from "../components/Icon";
import { ACTORS, PERM_CATS, type PermActor } from "../data/domain";
import type { PermsState } from "../types";
import type { ToastInput } from "../hooks/useToast";

interface Props {
  perms: PermsState;
  setPerms: React.Dispatch<React.SetStateAction<PermsState>>;
  onHome: () => void;
  notify: (t: ToastInput) => void;
}

/** Switch quadrato (visualizza=blu, modifica=colore attore). */
function Sw({ on, kind, onClick }: { on: boolean; kind: "v" | "e"; onClick: () => void }) {
  return <button className={`pm-sw${on ? ` on ${kind}` : ""}`} role="switch" aria-checked={on} onClick={onClick} type="button"><i /></button>;
}

/** Impostazioni · Permessi: cosa Faro e il commercialista vedono/modificano. */
export default function Permessi({ perms, setPerms, onHome, notify }: Props) {
  const [actor, setActor] = useState<PermActor>("faro");
  const meta = ACTORS[actor];
  const ap = perms[actor];

  const setCat = (cat: string, next: { v: boolean; e: boolean }) => setPerms((p) => ({ ...p, [actor]: { ...p[actor], [cat]: next } }));
  const toggleV = (cat: string) => {
    const cur = ap[cat];
    const v = !cur.v;
    setCat(cat, { v, e: v ? cur.e : false });
  };
  const toggleE = (cat: string) => {
    const cur = ap[cat];
    const e = !cur.e;
    setCat(cat, { v: e ? true : cur.v, e });
  };

  const preset = (level: "full" | "read" | "none") => {
    setPerms((p) => ({
      ...p,
      [actor]: PERM_CATS.reduce<Record<string, { v: boolean; e: boolean }>>((o, c) => {
        o[c.id] = level === "full" ? { v: true, e: true } : level === "read" ? { v: true, e: false } : { v: false, e: false };
        return o;
      }, {}),
    }));
    notify({ icon: "Shield", color: meta.color, title: "Permessi aggiornati", msg: `${meta.label} · ${level === "full" ? "accesso completo" : level === "read" ? "sola lettura" : "nessun accesso"}` });
  };

  const vCount = PERM_CATS.filter((c) => ap[c.id].v).length;
  const eCount = PERM_CATS.filter((c) => ap[c.id].e).length;

  return (
    <div className="vc pm">
      <div className="vc-crumb">
        <button onClick={onHome}>Home</button>
        <Icon name="Arrow" size={14} />
        <span>Impostazioni · Permessi</span>
      </div>
      <div className="vc-body">
        <div className="vc-titlewrap">
          <h1>Permessi di accesso</h1>
          <p>Decidi cosa Faro e il commercialista possono vedere e modificare nei dati del tuo account. Sono due attori distinti, con permessi indipendenti.</p>
        </div>

        <div className="pm-tabs">
          {(["faro", "comm"] as PermActor[]).map((id) => {
            const m = ACTORS[id];
            const ip = perms[id];
            const nv = PERM_CATS.filter((c) => ip[c.id].v).length;
            const ne = PERM_CATS.filter((c) => ip[c.id].e).length;
            return (
              <button key={id} className={`pm-tab${actor === id ? " on" : ""}`} style={{ ["--ac" as string]: m.color, ["--ac-soft" as string]: m.soft }} onClick={() => setActor(id)}>
                <div className="pm-tab-av" style={{ background: m.color }}>
                  {m.init}
                </div>
                <div className="pm-tab-tx">
                  <b>{m.label}</b>
                  <span>{m.role}</span>
                </div>
                <div className="pm-tab-meta">
                  {nv} viste · {ne} modifiche
                </div>
              </button>
            );
          })}
        </div>

        <div className="pm-panel" style={{ ["--ac" as string]: meta.color, ["--ac-soft" as string]: meta.soft, ["--ac-strong" as string]: meta.strong }}>
          <div className="pm-note">
            <div className="pm-note-ic">
              <Icon name={meta.icon} size={16} />
            </div>
            <span className="grow">{meta.note}</span>
            <div className="pm-presets">
              <button onClick={() => preset("full")}>Tutto</button>
              <button onClick={() => preset("read")}>Sola lettura</button>
              <button onClick={() => preset("none")}>Niente</button>
            </div>
          </div>

          <div className="pm-summary">
            <div className="pm-chip">
              <Icon name="Eye" size={14} />
              <b>{vCount}</b> categorie visibili
            </div>
            <div className="pm-chip">
              <Icon name="Pencil" size={14} />
              <b>{eCount}</b> modificabili
            </div>
          </div>

          <div className="pm-table">
            <div className="pm-thead">
              <span className="grow">Categoria di dati</span>
              <span className="pm-col">Visualizza</span>
              <span className="pm-col">Modifica</span>
            </div>
            {PERM_CATS.map((c) => {
              const st = ap[c.id];
              return (
                <div className={`pm-row${st.v ? "" : " off"}`} key={c.id}>
                  <div className="pm-cat">
                    <div className="pm-cat-ic">
                      <Icon name={c.icon} size={17} />
                    </div>
                    <div>
                      <b>{c.label}</b>
                      <span>{c.desc}</span>
                    </div>
                  </div>
                  <div className="pm-col">
                    <Sw on={st.v} kind="v" onClick={() => toggleV(c.id)} />
                  </div>
                  <div className="pm-col">
                    <Sw on={st.e} kind="e" onClick={() => toggleE(c.id)} />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pm-foot">
            <Icon name="Lock" size={14} />
            Le modifiche fuori permesso vengono sempre proposte, mai eseguite in autonomia. Puoi cambiare questi permessi in qualsiasi momento.
          </div>
        </div>

        <div className="pm-privacy">
          <Icon name="Shield" size={14} />
          <span>
            Il trattamento dei dati condivisi con Faro e il commercialista è regolato dalla{" "}
            <a href="https://www.teamsystem.com/privacy-policy" target="_blank" rel="noopener noreferrer">
              Privacy Policy di TeamSystem
            </a>
            .
          </span>
        </div>

        <div className="pm-save">
          <button className="btn ghost" onClick={onHome}>
            Indietro
          </button>
          <button
            className="btn blue"
            onClick={() => {
              notify({ icon: "Check", title: "Permessi salvati", msg: "Le impostazioni di accesso sono state aggiornate." });
              onHome();
            }}
          >
            <Icon name="Check" size={15} />
            Salva permessi
          </button>
        </div>
      </div>
    </div>
  );
}
