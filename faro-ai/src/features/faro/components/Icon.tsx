/**
 * Set di icone inline (stroke-based, peso 1.8) — portato 1:1 dal prototipo
 * faro-design-v2, che è la fonte di verità del design. Nessuna dipendenza
 * esterna: garantisce match visivo esatto.
 *
 * Uso: <Icon name="Sparkle" size={18} />
 */
import type { ReactNode, SVGProps } from "react";

/** Icone disegnate con `fill: currentColor` invece dello stroke. */
const FILLED = new Set(["Sparkle"]);

/** Contenuto (path/rect/circle) di ciascuna icona. */
const PATHS: Record<string, ReactNode> = {
  Grid: (
    <>
      <rect x={3} y={3} width={7} height={7} rx={1.5} />
      <rect x={14} y={3} width={7} height={7} rx={1.5} />
      <rect x={3} y={14} width={7} height={7} rx={1.5} />
      <rect x={14} y={14} width={7} height={7} rx={1.5} />
    </>
  ),
  Doc: (
    <>
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
      <path d="M14 3v5h5" />
      <path d="M9 13h6M9 17h4" />
    </>
  ),
  Cart: (
    <>
      <circle cx={9} cy={20} r={1.3} />
      <circle cx={18} cy={20} r={1.3} />
      <path d="M2 3h2.5l2 12.5h11l2-9H6" />
    </>
  ),
  Box: (
    <>
      <path d="M21 8 12 3 3 8v8l9 5 9-5z" />
      <path d="M3 8l9 5 9-5M12 13v8" />
    </>
  ),
  Users: (
    <>
      <circle cx={9} cy={8} r={3} />
      <path d="M3 20a6 6 0 0 1 12 0" />
      <path d="M16 5.5a3 3 0 0 1 0 5.8M21 20a6 6 0 0 0-5-5.9" />
    </>
  ),
  Bank: <path d="M3 10h18M5 10v8M19 10v8M9 10v8M15 10v8M3 18h18M12 3 3 8h18z" />,
  Chart: <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />,
  Cal: (
    <>
      <rect x={3} y={5} width={18} height={16} rx={2} />
      <path d="M3 9h18M8 3v4M16 3v4" />
    </>
  ),
  Search: (
    <>
      <circle cx={11} cy={11} r={7} />
      <path d="m20 20-3.5-3.5" />
    </>
  ),
  Bell: (
    <>
      <path d="M18 9a6 6 0 1 0-12 0c0 5-2 6-2 6h16s-2-1-2-6" />
      <path d="M10.5 19a2 2 0 0 0 3 0" />
    </>
  ),
  Help: (
    <>
      <circle cx={12} cy={12} r={9} />
      <path d="M9.5 9.5a2.5 2.5 0 0 1 4 1.8c0 1.6-2.5 1.7-2.5 3.2" />
      <path d="M12 17.5h.01" />
    </>
  ),
  Menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  Sparkle: (
    <>
      <path d="M10.5 3.5C10.9 8.5 12.3 10.2 18.5 11 12.3 11.8 10.9 13.5 10.5 20.5 10.1 13.5 8.7 11.8 3 11 8.7 10.2 10.1 8.5 10.5 3.5Z" />
      <path d="M18 3C18.2 5.4 18.7 5.9 21 6 18.7 6.1 18.2 6.7 18 9.2 17.8 6.7 17.3 6.1 15 6 17.3 5.9 17.8 5.4 18 3Z" />
    </>
  ),
  Send: (
    <>
      <path d="M22 2 11 13" />
      <path d="M22 2 15 22l-4-9-9-4z" />
    </>
  ),
  Arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
  ArrowUR: <path d="M7 17 17 7M9 7h8v8" />,
  Check: <path d="M5 12.5 10 17.5 19.5 6.5" />,
  CheckCircle: (
    <>
      <circle cx={12} cy={12} r={9} />
      <path d="M8.5 12.5 11 15l4.5-5" />
    </>
  ),
  Clock: (
    <>
      <circle cx={12} cy={12} r={9} />
      <path d="M12 7.5V12l3 1.8" />
    </>
  ),
  Alert: (
    <>
      <path d="M12 3 2 20h20z" />
      <path d="M12 9v5M12 17.5h.01" />
    </>
  ),
  Euro: (
    <>
      <path d="M16 7a6 6 0 1 0 0 10" />
      <path d="M4 10h8M4 14h7" />
    </>
  ),
  Money: (
    <>
      <rect x={2} y={6} width={20} height={12} rx={2} />
      <circle cx={12} cy={12} r={2.6} />
      <path d="M6 9v6M18 9v6" />
    </>
  ),
  X: <path d="M6 6l12 12M18 6 6 18" />,
  Dots: (
    <>
      <circle cx={5} cy={12} r={1.4} />
      <circle cx={12} cy={12} r={1.4} />
      <circle cx={19} cy={12} r={1.4} />
    </>
  ),
  Eye: (
    <>
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
      <circle cx={12} cy={12} r={2.6} />
    </>
  ),
  Repeat: (
    <>
      <path d="M17 2l4 4-4 4" />
      <path d="M3 11V9a4 4 0 0 1 4-4h14" />
      <path d="M7 22l-4-4 4-4" />
      <path d="M21 13v2a4 4 0 0 1-4 4H3" />
    </>
  ),
  Building: (
    <>
      <rect x={4} y={3} width={16} height={18} rx={1.5} />
      <path d="M9 7h.01M15 7h.01M9 11h.01M15 11h.01M9 15h.01M15 15h.01" />
    </>
  ),
  Stamp: (
    <>
      <path d="M9 4a3 3 0 0 1 6 0c0 2-1.5 3-1.5 5h-3C10.5 7 9 6 9 4z" />
      <path d="M5 15h14v3a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1zM5 21h14" />
    </>
  ),
  Phone: <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />,
  Trend: (
    <>
      <path d="M3 17l6-6 4 4 7-7" />
      <path d="M17 8h4v4" />
    </>
  ),
  Filter: <path d="M3 5h18l-7 8v6l-4-2v-4z" />,
  Plus: <path d="M12 5v14M5 12h14" />,
  Pencil: <path d="M15 5l4 4-9.5 9.5L5 20l1.5-4.5z" />,
  Shield: (
    <>
      <path d="M12 3l7 3v5c0 4.2-2.9 7.4-7 8.5-4.1-1.1-7-4.3-7-8.5V6z" />
      <path d="M9 12l2 2 4-4.5" />
    </>
  ),
  Gear: (
    <>
      <circle cx={12} cy={12} r={3.2} />
      <path d="M12 2.5l1.3 2.2 2.5-.5.3 2.5 2.2 1.3-1 2.3 1 2.3-2.2 1.3-.3 2.5-2.5-.5L12 21.5l-1.3-2.2-2.5.5-.3-2.5-2.2-1.3 1-2.3-1-2.3 2.2-1.3.3-2.5 2.5.5z" />
    </>
  ),
  Lock: (
    <>
      <rect x={5} y={11} width={14} height={9} rx={2} />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </>
  ),
  Chevron: <path d="M6 9l6 6 6-6" />,
  Panel: (
    <>
      <rect x={3} y={4} width={18} height={16} rx={2} />
      <path d="M15 4v16" />
    </>
  ),
};

export type IconName = keyof typeof PATHS;

interface IconProps extends Omit<SVGProps<SVGSVGElement>, "name"> {
  name: IconName;
  size?: number;
}

export function Icon({ name, size = 18, ...rest }: IconProps) {
  const filled = FILLED.has(name);
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke={filled ? "none" : "currentColor"}
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...rest}
    >
      {PATHS[name]}
    </svg>
  );
}

export default Icon;
