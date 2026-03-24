import {
  addGlobalUncaughtErrorHandler,
  registerMicroApps,
  runAfterFirstMounted,
  start,
} from "qiankun";

import type { MicroAppManifest, ShellAppProps } from "@qiankun-demo/contracts";
import { createLogger } from "@qiankun-demo/shared-utils";
import { matchHashRoutePrefix, resolveShellPath, useHashRouting } from "./basePath";

const logger = createLogger("shell");
let registered = false;
let started = false;
let hooked = false;

interface BootstrapQiankunOptions {
  manifests: MicroAppManifest[];
  createProps: (manifest: MicroAppManifest) => ShellAppProps;
  onLoadingChange?: (loading: boolean) => void;
}

export function bootstrapQiankun({
  manifests,
  createProps,
  onLoadingChange,
}: BootstrapQiankunOptions): void {
  if (!registered) {
    registerMicroApps(
      manifests.map((manifest) => ({
        name: manifest.name,
        entry: manifest.entry,
        container: manifest.mountContainer,
        activeRule: useHashRouting
          ? () => matchHashRoutePrefix(manifest.activeRule)
          : resolveShellPath(manifest.activeRule),
        loader: (loading) => onLoadingChange?.(loading),
        props: createProps(manifest),
      })),
      {
        beforeLoad: [
          async (app) => {
            logger.info("beforeLoad", { appName: app.name });
          },
        ],
        afterMount: [
          async (app) => {
            logger.info("afterMount", { appName: app.name });
          },
        ],
        afterUnmount: [
          async (app) => {
            logger.info("afterUnmount", { appName: app.name });
          },
        ],
      },
    );
    registered = true;
  }

  if (!hooked) {
    addGlobalUncaughtErrorHandler((event) => {
      const error =
        event instanceof ErrorEvent
          ? event.error ?? new Error(event.message)
          : new Error("Unknown micro app error");

      logger.error("micro-app uncaught error", {
        message: error.message,
      });
    });
    runAfterFirstMounted(() => {
      logger.info("first micro app mounted", {
        hint: "start performance monitor here",
      });
    });
    hooked = true;
  }

  if (!started) {
    start({
      prefetch: manifests.filter((manifest) => manifest.critical).map((manifest) => manifest.name),
      singular: true,
      sandbox: true,
    });
    started = true;
  }
}
