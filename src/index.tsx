import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { IpadMini } from "./screens/IpadMini/IpadMini";
import { ToastProvider } from "./contexts/ToastContext";

createRoot(document.getElementById("app") as HTMLElement).render(
  <StrictMode>
    <ToastProvider position="top-center" maxToasts={3}>
      <IpadMini />
    </ToastProvider>
  </StrictMode>,
);
