import { useState } from "react";
import Icon from "../components/Icon";

interface Props {
  onSend: (text: string) => void;
}

/** Casella di scrittura della chat Faro. */
export default function ChatComposer({ onSend }: Props) {
  const [input, setInput] = useState("");
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    onSend(input);
    setInput("");
  };
  return (
    <form className="fp-input" onSubmit={submit}>
      <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Scrivi a Faro…" />
      <button className="send" type="submit" disabled={!input.trim()}>
        <Icon name="Arrow" size={17} />
      </button>
    </form>
  );
}
