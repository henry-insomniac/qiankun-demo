#!/usr/bin/env node

import { execSync } from "node:child_process";
import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const packageJson = JSON.parse(
  readFileSync(path.join(rootDir, "package.json"), "utf8"),
);

function normalizePublicBasePath(basePath) {
  if (!basePath || basePath === "/") {
    return "/";
  }

  return `/${basePath.replace(/^\/+|\/+$/g, "")}/`;
}

function publicBaseToShellBase(publicBasePath) {
  return publicBasePath === "/" ? "" : publicBasePath.slice(0, -1);
}

function joinUnderBase(publicBasePath, suffix) {
  return `${publicBasePath}${suffix.replace(/^\/+/, "")}`;
}

function copyDirectoryContents(sourceDir, targetDir) {
  mkdirSync(targetDir, { recursive: true });

  for (const entry of ["index.html", "static"]) {
    const sourcePath = path.join(sourceDir, entry);
    cpSync(sourcePath, path.join(targetDir, entry), {
      recursive: true,
      force: true,
    });
  }
}

const repoName =
  process.env.PAGES_REPO_NAME ||
  process.env.GITHUB_REPOSITORY?.split("/").pop() ||
  packageJson.name;
const publicBasePath = normalizePublicBasePath(
  process.env.PAGES_BASE_PATH || `/${repoName}/`,
);
const shellBasePath = publicBaseToShellBase(publicBasePath);
const outputDir = path.join(rootDir, process.env.PAGES_OUTPUT_DIR || "dist-pages");

execSync("pnpm build", {
  cwd: rootDir,
  stdio: "inherit",
  env: {
    ...process.env,
    USE_HASH_ROUTING: "true",
    PUBLIC_BASE_PATH: publicBasePath,
    SHELL_BASE_PATH: shellBasePath,
    ORDERS_APP_ENTRY: joinUnderBase(publicBasePath, "apps/orders/"),
    ROOMS_APP_ENTRY: joinUnderBase(publicBasePath, "apps/rooms/"),
  },
});

rmSync(outputDir, { recursive: true, force: true });
mkdirSync(outputDir, { recursive: true });

copyDirectoryContents(path.join(rootDir, "apps/shell/dist"), outputDir);
cpSync(path.join(rootDir, "apps/orders-app/dist"), path.join(outputDir, "apps/orders"), {
  recursive: true,
  force: true,
});
cpSync(path.join(rootDir, "apps/rooms-app/dist"), path.join(outputDir, "apps/rooms"), {
  recursive: true,
  force: true,
});

writeFileSync(path.join(outputDir, ".nojekyll"), "");
writeFileSync(
  path.join(outputDir, "404.html"),
  `<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Redirecting…</title>
    <script>
      (function () {
        var redirectKey = "gh-pages-spa-path";
        var publicBasePath = ${JSON.stringify(publicBasePath)};
        var basePath = publicBasePath.replace(/\\/$/, "");
        var pathname = window.location.pathname;
        var logicalPath = pathname.indexOf(basePath) === 0 ? pathname.slice(basePath.length) || "/" : pathname;
        var redirectPath = "#" + logicalPath + window.location.search + window.location.hash;
        window.sessionStorage.setItem(redirectKey, redirectPath);
        window.location.replace(${JSON.stringify(publicBasePath)});
      })();
    </script>
  </head>
  <body></body>
</html>
`,
);
