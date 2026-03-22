import type {
  PlatformGlobalState,
  ShellSharedStateActions,
} from "@qiankun-demo/contracts";

type StateListener = (
  state: PlatformGlobalState,
  previousState: PlatformGlobalState,
) => void;

export const initialPlatformState: PlatformGlobalState = {
  tenantId: "tenant-demo",
  locale: "zh-CN",
  themeMode: "light",
};

let currentState: PlatformGlobalState = initialPlatformState;
const listeners = new Set<StateListener>();

function notifyStateChange(
  nextState: PlatformGlobalState,
  previousState: PlatformGlobalState,
): void {
  for (const listener of listeners) {
    listener(nextState, previousState);
  }
}

export function createSharedStateBridge(): ShellSharedStateActions {
  let localListener: StateListener | null = null;

  return {
    onGlobalStateChange(callback, fireImmediately) {
      if (localListener) {
        listeners.delete(localListener);
      }

      localListener = callback;
      listeners.add(localListener);

      if (fireImmediately) {
        callback(currentState, currentState);
      }
    },
    setGlobalState(state) {
      const previousState = currentState;
      currentState = {
        ...currentState,
        ...state,
      };
      notifyStateChange(currentState, previousState);
      return true;
    },
    offGlobalStateChange() {
      if (localListener) {
        listeners.delete(localListener);
        localListener = null;
      }

      return true;
    },
  };
}

export function getPlatformState(): PlatformGlobalState {
  return currentState;
}
