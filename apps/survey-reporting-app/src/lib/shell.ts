import type { InjectionKey } from "vue";
import { inject } from "vue";

import type { ShellAppProps } from "@qiankun-demo/contracts";

export type SurveyShellProps = Partial<ShellAppProps>;

export const shellPropsKey: InjectionKey<SurveyShellProps> = Symbol(
  "survey-reporting-shell-props",
);

const fallbackShellProps: SurveyShellProps = {
  appName: "survey-reporting-app",
  routeBase: "/",
  currentUser: {
    id: "standalone-user",
    name: "Standalone User",
    locale: "zh-CN",
    tenantId: "standalone",
  },
  theme: {
    mode: "light",
    tokensVersion: "standalone",
  },
};

export function useShellProps(): SurveyShellProps {
  return inject(shellPropsKey, fallbackShellProps);
}
