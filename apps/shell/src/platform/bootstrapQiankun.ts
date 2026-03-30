import {
  addGlobalUncaughtErrorHandler,
  registerMicroApps,
  runAfterFirstMounted,
  start,
} from "qiankun";

import type { MicroAppManifest, ShellAppProps } from "@qiankun-demo/contracts";
import { createLogger } from "@qiankun-demo/shared-utils";

const logger = createLogger("shell");
let registered = false;
let started = false;
let hooked = false;

function isExternalExtensionError(input: unknown): boolean {
  if (!input) {
    return false;
  }

  if (typeof input === "string") {
    return /(chrome-extension|moz-extension):\/\//i.test(input);
  }

  if (input instanceof ErrorEvent) {
    return isExternalExtensionError(
      `${input.message}\n${input.filename}\n${input.error?.stack ?? ""}`,
    );
  }

  if (input instanceof Error) {
    return isExternalExtensionError(`${input.message}\n${input.stack ?? ""}`);
  }

  if (typeof input === "object") {
    const maybeRecord = input as Record<string, unknown>;
    return isExternalExtensionError(
      `${String(maybeRecord.message ?? "")}\n${String(maybeRecord.stack ?? "")}\n${String(
        maybeRecord.filename ?? "",
      )}`,
    );
  }

  return false;
}

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
        activeRule: manifest.activeRule,
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
      if (isExternalExtensionError(event)) {
        return;
      }

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
