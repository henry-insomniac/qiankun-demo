import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import "@qiankun-demo/design-tokens/styles.css";

import App from "./App";
import { shellBasePath } from "./platform/basePath";
import "./styles.css";

const rootContainer = document.getElementById("root");

if (!rootContainer) {
  throw new Error("Shell root container #root not found.");
}

createRoot(rootContainer).render(
  <StrictMode>
    <BrowserRouter
      basename={shellBasePath || undefined}
      future={{
        v7_relativeSplatPath: true,
        v7_startTransition: true,
      }}
    >
      <App />
    </BrowserRouter>
  </StrictMode>,
);
