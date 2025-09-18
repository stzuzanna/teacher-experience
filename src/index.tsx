import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { IpadMini } from "./screens/IpadMini/IpadMini";
import { NewsFeed } from "./screens/NewsFeed/NewsFeed";
import { ToastProvider } from "./contexts/ToastContext";

const params = new URLSearchParams(window.location.search);
const screen = params.get("screen");

const Root = () => {
  if (screen === "newsfeed") {
    return (
      <NewsFeed
        onNavigateBack={() => window.history.back()}
        activeNavItem="news"
        onNavClick={() => {}}
      />
    );
  }
  return <IpadMini />;
};

createRoot(document.getElementById("app") as HTMLElement).render(
  <StrictMode>
    <ToastProvider position="top-center" maxToasts={3}>
      <Root />
    </ToastProvider>
  </StrictMode>,
);
