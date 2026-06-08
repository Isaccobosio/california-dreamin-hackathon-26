import { VaporThemeProvider } from "@vapor/react-material";
import CssBaseline from "@mui/material/CssBaseline";
import FaroApp from "./features/faro/FaroApp";

/**
 * Root dell'applicazione. Avvolge la feature Faro nel tema Vapor "light"
 * così funziona sia in standalone (main.tsx) sia come remote federato
 * (remote-config.ts).
 */
export default function App() {
  return (
    <VaporThemeProvider name="vapor-light">
      <CssBaseline />
      <FaroApp />
    </VaporThemeProvider>
  );
}
