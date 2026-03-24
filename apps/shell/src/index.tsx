import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, HashRouter } from "react-router-dom";

import "@qiankun-demo/design-tokens/styles.css";

import App from "./App";
import { shellBasePath, useHashRouting } from "./platform/basePath";
import "./styles.css";

const rootContainer = document.getElementById("root");

if (!rootContainer) {
  throw new Error("Shell root container #root not found.");
}

const Router = useHashRouting ? HashRouter : BrowserRouter;

createRoot(rootContainer).render(
  <StrictMode>
    <Router
      basename={useHashRouting ? undefined : shellBasePath || undefined}
      future={{
        v7_relativeSplatPath: true,
        v7_startTransition: true,
      }}
    >
      <App />
    </Router>
  </StrictMode>,
);
