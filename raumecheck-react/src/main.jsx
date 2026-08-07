import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ToastProvider } from "./components/toast/ToastContext";
import { AppStateProvider } from "./state/AppStateContext";
import { ExcelLinkProvider } from "./state/ExcelLinkContext";
import App from "./App.jsx";
import "./styles/index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ToastProvider>
      <AppStateProvider>
        <ExcelLinkProvider>
          <App />
        </ExcelLinkProvider>
      </AppStateProvider>
    </ToastProvider>
  </StrictMode>,
);
