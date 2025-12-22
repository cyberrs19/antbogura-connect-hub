import { createRoot } from "react-dom/client";
import AppErrorBoundary from "@/components/app/AppErrorBoundary";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <AppErrorBoundary>
    <App />
  </AppErrorBoundary>
);

