export interface Logger {
  info(message: string, payload?: Record<string, unknown>): void;
  warn(message: string, payload?: Record<string, unknown>): void;
  error(message: string, payload?: Record<string, unknown>): void;
}

function formatLogMessage(appName: string, message: string): string {
  return `[${appName}] ${message}`;
}

export function createLogger(appName: string): Logger {
  return {
    info(message, payload) {
      console.info(formatLogMessage(appName, message), payload ?? {});
    },
    warn(message, payload) {
      console.warn(formatLogMessage(appName, message), payload ?? {});
    },
    error(message, payload) {
      console.error(formatLogMessage(appName, message), payload ?? {});
    },
  };
}

