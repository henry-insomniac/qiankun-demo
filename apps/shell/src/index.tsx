import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import "@qiankun-demo/design-tokens/styles.css";

import { ThemeProvider } from "next-themes";
import { themeIds, DEFAULT_THEME } from "./lib/theme";

import App from "./App";
import { shellBasePath } from "./platform/basePath";
import "./styles.css";

const rootContainer = document.getElementById("root");

if (!rootContainer) {
  throw new Error("Shell root container #root not found.");
}

createRoot(rootContainer).render(
  <StrictMode>
    <ThemeProvider
      attribute="data-theme"
      defaultTheme={DEFAULT_THEME}
      themes={themeIds}
      enableSystem={false}
      disableTransitionOnChange
    >
      <BrowserRouter
        basename={shellBasePath || undefined}
        future={{
          v7_relativeSplatPath: true,
          v7_startTransition: true,
        }}
      >
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>,
);
