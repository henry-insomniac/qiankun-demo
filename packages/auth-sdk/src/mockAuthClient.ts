import type {
  ShellAuthBridge,
  ShellCurrentUser,
} from "@qiankun-demo/contracts";

export interface MockAuthSession {
  authenticated: boolean;
  accessToken: string | null;
  user: ShellCurrentUser | null;
  expiresAt: string | null;
}

export interface MockAuthClient extends ShellAuthBridge {
  getSession(): MockAuthSession;
  loginAsDemoUser(): Promise<void>;
  subscribe(listener: (session: MockAuthSession) => void): () => void;
}

const DEMO_USER: ShellCurrentUser = {
  id: "demo-user",
  name: "Platform Demo",
  tenantId: "tenant-demo",
  locale: "zh-CN",
};

function createInitialSession(): MockAuthSession {
  return {
    authenticated: true,
    accessToken: "demo-access-token",
    user: DEMO_USER,
    expiresAt: new Date(Date.now() + 30 * 60_000).toISOString(),
  };
}

export function createMockAuthClient(): MockAuthClient {
  let session = createInitialSession();
  const listeners = new Set<(session: MockAuthSession) => void>();

  const notify = () => {
    for (const listener of listeners) {
      listener(session);
    }
  };

  return {
    isAuthenticated() {
      return session.authenticated;
    },
    async getAccessToken() {
      return session.accessToken;
    },
    async getCurrentUser() {
      return session.user;
    },
    async refresh() {
      if (!session.authenticated) {
        throw new Error("Cannot refresh an anonymous session.");
      }

      session = {
        ...session,
        expiresAt: new Date(Date.now() + 30 * 60_000).toISOString(),
      };
      notify();
    },
    async logout() {
      session = {
        authenticated: false,
        accessToken: null,
        user: null,
        expiresAt: null,
      };
      notify();
    },
    getSession() {
      return session;
    },
    async loginAsDemoUser() {
      session = createInitialSession();
      notify();
    },
    subscribe(listener) {
      listeners.add(listener);
      listener(session);

      return () => {
        listeners.delete(listener);
      };
    },
  };
}

