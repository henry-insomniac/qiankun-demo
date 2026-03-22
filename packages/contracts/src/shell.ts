export type ThemeMode = "light" | "dark" | "system";

export interface ShellCurrentUser {
  id: string;
  name: string;
  tenantId?: string;
  locale?: string;
}

export interface PlatformGlobalState {
  tenantId: string;
  locale: string;
  themeMode: ThemeMode;
}

export interface ShellNavigation {
  push(path: string): void;
  replace(path: string): void;
}

export interface ShellTelemetry {
  log(event: string, payload?: Record<string, unknown>): void;
  error(error: Error, context?: Record<string, unknown>): void;
  traceId(): string;
}

export interface ShellAuthBridge {
  isAuthenticated(): boolean;
  getAccessToken(): Promise<string | null>;
  getCurrentUser(): Promise<ShellCurrentUser | null>;
  refresh(): Promise<void>;
  logout(options?: { redirectTo?: string }): Promise<void>;
}

export interface ShellSharedStateActions {
  onGlobalStateChange?(
    callback: (
      state: PlatformGlobalState,
      previousState: PlatformGlobalState,
    ) => void,
    fireImmediately?: boolean,
  ): void;
  setGlobalState?(state: Partial<PlatformGlobalState>): boolean;
  offGlobalStateChange?(): boolean;
}

export interface ShellAppProps {
  appName: string;
  routeBase: string;
  container?: HTMLElement;
  currentUser: ShellCurrentUser | null;
  auth: ShellAuthBridge;
  navigation: ShellNavigation;
  telemetry: ShellTelemetry;
  theme: {
    mode: ThemeMode;
    tokensVersion: string;
  };
  sharedState?: ShellSharedStateActions;
}

