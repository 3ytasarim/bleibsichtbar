import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

/* ── Sağ tık & resim koruma ── */
document.addEventListener("contextmenu", (e) => e.preventDefault());
document.addEventListener("dragstart", (e) => {
  if ((e.target as HTMLElement).tagName === "IMG") e.preventDefault();
});
document.addEventListener("selectstart", (e) => {
  if (window.location.pathname.startsWith("/admin")) return;
  const t = e.target as HTMLElement;
  if (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable) return;
  e.preventDefault();
});

createRoot(document.getElementById("root")!).render(<App />);
