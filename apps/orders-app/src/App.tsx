import { useEffect, useState } from "react";
import { BrowserRouter, Link, Route, Routes, useParams } from "react-router-dom";

import { createMockAuthClient } from "@qiankun-demo/auth-sdk";
import type {
  PlatformGlobalState,
  ShellAppProps,
  ShellCurrentUser,
} from "@qiankun-demo/contracts";
import { TOKENS_VERSION } from "@qiankun-demo/design-tokens";
import { createLogger, createTraceId } from "@qiankun-demo/shared-utils";

import "./styles.css";

const standaloneAuthClient = createMockAuthClient();
const standaloneLogger = createLogger("orders-app");

const fallbackShellProps: ShellAppProps = {
  appName: "orders-app",
  routeBase: "/",
  currentUser: standaloneAuthClient.getSession().user,
  auth: standaloneAuthClient,
  navigation: {
    push(path) {
      window.history.pushState(null, "", path);
      window.dispatchEvent(new PopStateEvent("popstate"));
    },
    replace(path) {
      window.history.replaceState(null, "", path);
      window.dispatchEvent(new PopStateEvent("popstate"));
    },
  },
  telemetry: {
    log(event, payload) {
      standaloneLogger.info(`event:${event}`, payload);
    },
    error(error, context) {
      standaloneLogger.error(error.message, {
        ...context,
        stack: error.stack,
      });
    },
    traceId() {
      return createTraceId("orders");
    },
  },
  theme: {
    mode: "light",
    tokensVersion: TOKENS_VERSION,
  },
};

function Dashboard({
  currentUser,
  shellProps,
  themeMode,
}: {
  currentUser: ShellCurrentUser | null;
  shellProps: ShellAppProps;
  themeMode: PlatformGlobalState["themeMode"];
}) {
  return (
    <section className="orders-app__card">
      <span className="orders-app__eyebrow">Orders Domain</span>
      <h1>订单系统微应用</h1>
      <p>
        当前用户：{currentUser?.name ?? "匿名"}，租户：{currentUser?.tenantId ?? "未绑定"}
      </p>
      <p>当前主题：{themeMode}</p>
      <div className="orders-app__actions">
        <Link className="orders-app__link" to="/detail/20260322">
          查看订单详情
        </Link>
        <button
          className="orders-app__button"
          onClick={() =>
            shellProps.telemetry.log("orders.open-dashboard", {
              traceId: shellProps.telemetry.traceId(),
            })
          }
        >
          发送埋点
        </button>
        <button
          className="orders-app__button orders-app__button--ghost"
          onClick={() => shellProps.navigation.push("/profile")}
        >
          跳到 Shell 个人中心
        </button>
      </div>
    </section>
  );
}

function OrderDetail() {
  const params = useParams();

  return (
    <section className="orders-app__card orders-app__card--compact">
      <span className="orders-app__eyebrow">Detail</span>
      <h1>订单详情</h1>
      <p>订单号：{params.orderId}</p>
      <Link className="orders-app__link" to="/">
        返回订单首页
      </Link>
    </section>
  );
}

export default function OrdersApp({
  shellProps = fallbackShellProps,
}: {
  shellProps?: ShellAppProps;
}) {
  const [currentUser, setCurrentUser] = useState<ShellCurrentUser | null>(
    shellProps.currentUser,
  );
  const [themeMode, setThemeMode] = useState<PlatformGlobalState["themeMode"]>(
    shellProps.theme.mode,
  );

  useEffect(() => {
    let active = true;

    void shellProps.auth.getCurrentUser().then((user) => {
      if (active) {
        setCurrentUser(user);
      }
    });

    shellProps.sharedState?.onGlobalStateChange?.((state) => {
      setThemeMode(state.themeMode);
    }, true);

    return () => {
      active = false;
      shellProps.sharedState?.offGlobalStateChange?.();
    };
  }, [shellProps]);

  return (
    <div className={`orders-app orders-app--theme-${themeMode}`}>
      <BrowserRouter
        basename={shellProps.routeBase}
        future={{
          v7_relativeSplatPath: true,
          v7_startTransition: true,
        }}
      >
        <div className="orders-app__shell">
          <header className="orders-app__header">
            <div>
              <span className="orders-app__eyebrow">Mounted by qiankun</span>
              <h1>{shellProps.appName}</h1>
            </div>
            <button
              className="orders-app__button orders-app__button--ghost"
              onClick={() => void shellProps.auth.logout().then(() => shellProps.navigation.push("/login"))}
            >
              退出并回到登录页
            </button>
          </header>

          <Routes>
            <Route
              path="/"
              element={
                <Dashboard
                  currentUser={currentUser}
                  shellProps={shellProps}
                  themeMode={themeMode}
                />
              }
            />
            <Route path="/detail/:orderId" element={<OrderDetail />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}
