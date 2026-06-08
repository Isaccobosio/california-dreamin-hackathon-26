import { useState } from "react";
import { Box, Typography, Breadcrumbs, Link, Paper, Switch, Avatar } from "@vapor/react-material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ICON } from "../data/icons";

interface PermessiProps {
  onHome: () => void;
}

type PermActor = "faro" | "comm";
/** v = vede · e = modifica */
type PermKind = "v" | "e";
type Perms = Record<PermActor, Record<string, PermKind[]>>;

interface Area {
  id: string;
  label: string;
  desc: string;
}

interface ActorMeta {
  label: string;
  sub: string;
  color: string;
  initial: string;
}

const AREAS: Area[] = [
  { id: "fatture", label: "Fatture e corrispettivi", desc: "Emesse, ricevute, SDI" },
  { id: "incassi", label: "Incassi e pagamenti", desc: "Scadenze, solleciti" },
  { id: "banca", label: "Movimenti bancari", desc: "Conti e riconciliazioni" },
  { id: "fiscale", label: "Adempimenti fiscali", desc: "F24, dichiarazioni" },
  { id: "anagrafiche", label: "Anagrafiche", desc: "Clienti e fornitori" },
];

const DEFAULT_PERMS: Perms = {
  faro: { fatture: ["v", "e"], incassi: ["v", "e"], banca: ["v"], fiscale: ["v"], anagrafiche: ["v", "e"] },
  comm: { fatture: ["v"], incassi: ["v"], banca: ["v"], fiscale: ["v", "e"], anagrafiche: ["v"] },
};

const META: Record<PermActor, ActorMeta> = {
  faro: { label: "Faro (AI)", sub: "Assistente automatico", color: "var(--faro)", initial: "✦" },
  comm: { label: "Commercialista", sub: "Luca Ferri", color: "#09822A", initial: "LF" },
};

export default function Permessi({ onHome }: PermessiProps) {
  const [perms, setPerms] = useState<Perms>(DEFAULT_PERMS);

  const toggle = (actor: PermActor, area: string, kind: PermKind) =>
    setPerms((p) => {
      const cur = new Set(p[actor][area]);
      if (cur.has(kind)) cur.delete(kind);
      else cur.add(kind);
      if (kind === "v" && !cur.has("v")) cur.delete("e"); // niente edit senza view
      if (kind === "e" && cur.has("e")) cur.add("v");
      return { ...p, [actor]: { ...p[actor], [area]: [...cur] } };
    });

  const actorHeader = (meta: ActorMeta) => (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
      <Avatar sx={{ width: 32, height: 32, borderRadius: 1.25, fontSize: 12, fontWeight: 800, bgcolor: meta.color }}>{meta.initial}</Avatar>
      <Box>
        <Typography sx={{ fontWeight: 800, fontSize: 13.5 }}>{meta.label}</Typography>
        <Typography sx={{ fontSize: 11, color: "text.secondary" }}>{meta.sub}</Typography>
      </Box>
    </Box>
  );

  const cell = (actor: PermActor, area: string) => (
    <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
      {(
        [
          ["v", "Vede"],
          ["e", "Modifica"],
        ] as Array<[PermKind, string]>
      ).map(([k, lbl]) => (
        <Box key={k} sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0.25 }}>
          <Switch size="small" checked={perms[actor][area].includes(k)} onChange={() => toggle(actor, area, k)} />
          <Typography sx={{ fontSize: 10.5, color: "text.secondary", fontWeight: 700 }}>{lbl}</Typography>
        </Box>
      ))}
    </Box>
  );

  return (
    <Box sx={{ flex: 1, overflowY: "auto", bgcolor: "background.default" }}>
      <Box sx={{ px: 3, py: 2 }}>
        <Breadcrumbs>
          <Link component="button" onClick={onHome} underline="hover">
            Home
          </Link>
          <Typography color="text.primary">Permessi di accesso</Typography>
        </Breadcrumbs>
      </Box>
      <Box sx={{ maxWidth: 920, mx: "auto", px: 3, pb: 5 }}>
        <Typography sx={{ fontSize: 30, fontWeight: 800, letterSpacing: "-.6px" }}>Permessi di accesso</Typography>
        <Typography sx={{ fontSize: 14, color: "text.secondary", mt: 0.75, mb: 3 }}>
          Gestisci cosa Faro e il commercialista possono vedere e modificare nel tuo account. Sono due attori distinti.
        </Typography>

        <Paper variant="outlined" sx={{ borderRadius: 2.25, overflow: "hidden" }}>
          <Box sx={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr", alignItems: "center", p: 2, borderBottom: "1px solid", borderColor: "divider", bgcolor: "action.hover" }}>
            <Typography sx={{ fontSize: 12, fontWeight: 800, color: "text.secondary" }}>AREA DATI</Typography>
            {actorHeader(META.faro)}
            {actorHeader(META.comm)}
          </Box>
          {AREAS.map((ar, i) => (
            <Box key={ar.id} sx={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr", alignItems: "center", p: 2, borderBottom: i < AREAS.length - 1 ? "1px solid" : "none", borderColor: "divider" }}>
              <Box>
                <Typography sx={{ fontWeight: 700, fontSize: 13.5 }}>{ar.label}</Typography>
                <Typography sx={{ fontSize: 11.5, color: "text.secondary" }}>{ar.desc}</Typography>
              </Box>
              {cell("faro", ar.id)}
              {cell("comm", ar.id)}
            </Box>
          ))}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.1, p: 2, bgcolor: "action.hover", fontSize: 12.5, fontWeight: 600, color: "text.secondary" }}>
            <FontAwesomeIcon icon={ICON.shield} />
            Le modifiche fuori permesso vengono sempre proposte, mai eseguite in autonomia. Puoi cambiare questi permessi in qualsiasi momento.
          </Box>
        </Paper>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1.1, mt: 2, px: 0.5, fontSize: 12.5, color: "text.secondary", fontWeight: 600 }}>
          <FontAwesomeIcon icon={ICON.shield} />
          <span>
            Il trattamento dei dati condivisi con Faro e il commercialista è regolato dalla{" "}
            <Link href="https://www.teamsystem.com/privacy-policy" target="_blank" rel="noopener noreferrer">
              Privacy Policy di TeamSystem
            </Link>
            .
          </span>
        </Box>
      </Box>
    </Box>
  );
}
