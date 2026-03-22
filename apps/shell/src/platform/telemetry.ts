import type { ShellTelemetry } from "@qiankun-demo/contracts";
import { createLogger, createTraceId } from "@qiankun-demo/shared-utils";

const logger = createLogger("shell");
const traceId = createTraceId("shell");

export const shellTelemetry: ShellTelemetry = {
  log(event, payload) {
    logger.info(`event:${event}`, payload);
  },
  error(error, context) {
    logger.error(error.message, {
      ...context,
      stack: error.stack,
    });
  },
  traceId() {
    return traceId;
  },
};

