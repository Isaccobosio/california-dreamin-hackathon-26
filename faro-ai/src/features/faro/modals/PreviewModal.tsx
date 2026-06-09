import EmailPreview from "./EmailPreview";
import DocPreview from "./DocPreview";
import { artifact } from "../data/domain";
import type { FaroAction } from "../types";

interface Props {
  a: FaroAction | null;
  onCancel: () => void;
  onConfirm: (edited: boolean) => void;
}

/** Anteprima dell'artefatto preparato da Faro prima della conferma. */
export default function PreviewModal({ a, onCancel, onConfirm }: Props) {
  if (!a) return null;
  const art = artifact(a);
  return art.kind === "email" ? <EmailPreview art={art} onCancel={onCancel} onConfirm={onConfirm} /> : <DocPreview art={art} onCancel={onCancel} onConfirm={onConfirm} />;
}
