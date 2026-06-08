/**
 * Stile dei pulsanti brand Faro (viola).
 * Il tema Vapor "light" non espone un color="violet" tipizzato, quindi il
 * colore brand viene applicato via sx usando i token CSS (--faro*).
 * Oggetti semplici per poter essere fusi via spread: sx={{ ...faroContainedSx, mt: 1 }}.
 */
export const faroContainedSx = {
  bgcolor: "var(--faro)",
  color: "#fff",
  "&:hover": { bgcolor: "var(--faro-strong)" },
};

export const faroOutlinedSx = {
  color: "var(--faro-strong)",
  borderColor: "var(--faro)",
  "&:hover": { borderColor: "var(--faro-strong)", bgcolor: "var(--faro-soft)" },
};
