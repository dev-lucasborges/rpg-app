import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

const theme = createTheme({
  palette: {
    mode: "dark", // Ativa o tema escuro
    background: {
      default: "#111111", // Cor de fundo (body)
    },
    primary: {
      main: "#F94655", // Accent
    },
    secondary: {
      main: "#161625", // Secondary (para a navbar)
    },
    custom: {
      onAccent: "rgba(249, 70, 85, 0.1)", // onAccent com opacidade
      iconInactive: "#9095A5", // Cor personalizada para ícones inativos
    },
  },
  typography: {
    fontFamily: "DM Sans, sans-serif",
  },
});

createRoot(document.getElementById("root")).render(
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <StrictMode>
      <App />
    </StrictMode>
  </ThemeProvider>
);
