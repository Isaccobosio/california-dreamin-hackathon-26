/** Mappa icone FontAwesome (Pro Solid) usate da Faro. */
import {
  faPaperPlane,
  faFileLines,
  faBuildingColumns,
  faRepeat,
  faMoneyBill1,
  faPen,
  faEuroSign,
  faClock,
  faCircleCheck,
  faStamp,
  faRobot,
  faChartColumn,
  faClockRotateLeft,
  faArrowUpRightFromSquare,
  faShieldHalved,
  faArrowTrendUp,
  faCalendarDays,
  faEnvelope,
  faLandmark,
  faGear,
} from "@fortawesome/pro-solid-svg-icons";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import type { ActionKind } from "../types";

/** Icona per ciascun tipo di azione. */
export const KIND_ICON: Record<ActionKind, IconDefinition> = {
  sollecito: faPaperPlane,
  sdi: faFileLines,
  riconcilia: faBuildingColumns,
  ricorrente: faRepeat,
  incasso: faMoneyBill1,
  scartata: faPen,
  f24: faEuroSign,
};

/** Icone trasversali (UI, stato, fonti). */
export const ICON = {
  ...KIND_ICON,
  clock: faClock,
  check: faCircleCheck,
  stamp: faStamp,
  faro: faRobot,
  chart: faChartColumn,
  history: faClockRotateLeft,
  ext: faArrowUpRightFromSquare,
  shield: faShieldHalved,
  trend: faArrowTrendUp,
  cal: faCalendarDays,
  email: faEnvelope,
  bank: faLandmark,
  euro: faEuroSign,
  gear: faGear,
} satisfies Record<string, IconDefinition>;
