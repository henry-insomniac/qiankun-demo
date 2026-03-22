import { useEffect, useState } from "react";
import { NavLink, Navigate, Route, Routes, useLocation } from "react-router-dom";

import { createMockAuthClient } from "@qiankun-demo/auth-sdk";
import type { PlatformGlobalState } from "@qiankun-demo/contracts";
import { TOKENS_VERSION } from "@qiankun-demo/design-tokens";

import { bootstrapQiankun } from "./platform/bootstrapQiankun";
import {
  createSharedStateBridge,
  getPlatformState,
  initialPlatformState,
} from "./platform/globalState";
import { microAppManifests } from "./platform/manifest";
import { shellNavigation } from "./platform/navigation";
import { shellTelemetry } from "./platform/telemetry";

const authClient = createMockAuthClient();
const shellSharedState = createSharedStateBridge();

function HomePage() {
  return (
    <section className="shell-page-card">
      <span className="shell-badge">Platform Overview</span>
      <h1>生产级 qiankun 骨架已就位</h1>
      <p>
        这个 shell 负责导航、鉴权门面、主题、日志与微应用注册。真实业务系统后续按同一 contract 接入。
      </p>
      <div className="shell-grid">
        <article>
          <h2>统一入口</h2>
          <p>Shell 是全局路由入口，负责布局、导航、错误边界和版本清单。</p>
        </article>
        <article>
          <h2>统一身份</h2>
          <p>当前是 mock auth facade，真实环境替换为 SSO/OIDC/BFF 即可。</p>
        </article>
        <article>
          <h2>统一设计</h2>
          <p>Shell 与微应用都消费同一套 design tokens，而不是依赖样式碰运气。</p>
        </article>
      </div>
    </section>
  );
}

function LoginPage({ onLogin }: { onLogin: () => Promise<void> }) {
  return (
    <section className="shell-page-card shell-page-card--compact">
      <span className="shell-badge">Auth Facade</span>
      <h1>登录页</h1>
      <p>第一版用 mock 会话模拟统一账号能力，后续替换成真实 IdP 即可。</p>
      <button className="shell-button" onClick={() => void onLogin()}>
        以 Demo 用户登录
      </button>
    </section>
  );
}

function ProfilePage() {
  return (
    <section className="shell-page-card">
      <span className="shell-badge">Shell Native Page</span>
      <h1>个人中心</h1>
      <p>这是 shell 自己的页面，用来验证“shell 原生页面”和“微应用页面”可以共存。</p>
    </section>
  );
}

function OrdersHostPage({ loading }: { loading: boolean }) {
  return (
    <section className="shell-page-card shell-page-card--compact">
      <span className="shell-badge">Micro App Host</span>
      <h1>Orders 微应用容器</h1>
      <p>当前路由进入 `/orders` 后，qiankun 会把微应用挂载到右侧容器里。</p>
      <p>加载状态：{loading ? "加载中" : "已就绪"}</p>
    </section>
  );
}

function RoomsHostPage({ loading }: { loading: boolean }) {
  return (
    <section className="shell-page-card shell-page-card--compact">
      <span className="shell-badge">Micro App Host</span>
      <h1>样板间微应用容器</h1>
      <p>当前路由进入 `/rooms` 后，qiankun 会把微应用挂载到右侧容器里。</p>
      <p>加载状态：{loading ? "加载中" : "已就绪"}</p>
    </section>
  );
}

function NotFoundPage() {
  return (
    <section className="shell-page-card shell-page-card--compact">
      <span className="shell-badge">404</span>
      <h1>页面不存在</h1>
      <p>Shell 保留全局 404，微应用只处理自己 base route 内的页面。</p>
    </section>
  );
}

function RequireAuth({
  authenticated,
  children,
}: {
  authenticated: boolean;
  children: JSX.Element;
}) {
  if (!authenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default function App() {
  const location = useLocation();
  const [session, setSession] = useState(authClient.getSession());
  const [platformState, setPlatformState] =
    useState<PlatformGlobalState>(initialPlatformState);
  const [microAppLoading, setMicroAppLoading] = useState(false);
  const isOrdersRoute = location.pathname.startsWith("/orders");
  const isRoomsRoute = location.pathname.startsWith("/rooms");

  useEffect(() => {
    return authClient.subscribe(setSession);
  }, []);

  useEffect(() => {
    shellSharedState.onGlobalStateChange?.((nextState) => {
      setPlatformState(nextState);
    }, true);

    return () => {
      shellSharedState.offGlobalStateChange?.();
    };
  }, []);

  useEffect(() => {
    bootstrapQiankun({
      manifests: microAppManifests,
      createProps: (manifest) => ({
        appName: manifest.name,
        routeBase: manifest.routeBase,
        currentUser: authClient.getSession().user,
        auth: authClient,
        navigation: shellNavigation,
        telemetry: shellTelemetry,
        theme: {
          mode: getPlatformState().themeMode,
          tokensVersion: TOKENS_VERSION,
        },
        sharedState: createSharedStateBridge(),
      }),
      onLoadingChange: setMicroAppLoading,
    });
  }, []);

  async function handleLogin(): Promise<void> {
    await authClient.loginAsDemoUser();
    shellNavigation.replace("/");
  }

  async function handleLogout(): Promise<void> {
    await authClient.logout();
    shellNavigation.replace("/login");
  }

  function toggleTheme(): void {
    shellSharedState.setGlobalState?.({
      themeMode: platformState.themeMode === "light" ? "dark" : "light",
    });
  }

  return (
    <div className={`shell shell--theme-${platformState.themeMode}`}>
      <aside className="shell-sidebar">
        <div className="shell-sidebar__brand">
          <span className="shell-badge">qiankun</span>
          <strong>Platform Shell</strong>
        </div>
        <nav className="shell-sidebar__nav">
          <NavLink to="/">总览</NavLink>
          <NavLink to="/orders">订单系统</NavLink>
          <NavLink to="/rooms">样板间</NavLink>
          <NavLink to="/profile">个人中心</NavLink>
        </nav>
        <div className="shell-sidebar__meta">
          <span>Tenant: {platformState.tenantId}</span>
          <span>Locale: {platformState.locale}</span>
          <span>Trace: {shellTelemetry.traceId().slice(0, 18)}...</span>
        </div>
      </aside>

      <div className="shell-main">
        <header className="shell-header">
          <div>
            <p className="shell-header__eyebrow">Production-ready scaffold</p>
            <h1>统一入口、统一契约、统一质量门禁</h1>
          </div>
          <div className="shell-header__actions">
            <button className="shell-button shell-button--ghost" onClick={toggleTheme}>
              切换主题
            </button>
            {session.authenticated ? (
              <button className="shell-button" onClick={() => void handleLogout()}>
                退出
              </button>
            ) : (
              <button className="shell-button" onClick={() => void handleLogin()}>
                登录
              </button>
            )}
          </div>
        </header>

        <div className="shell-main__body">
          <div className="shell-main__content">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
              <Route
                path="/profile"
                element={
                  <RequireAuth authenticated={session.authenticated}>
                    <ProfilePage />
                  </RequireAuth>
                }
              />
              <Route
                path="/orders/*"
                element={
                  <RequireAuth authenticated={session.authenticated}>
                    <OrdersHostPage loading={microAppLoading} />
                  </RequireAuth>
                }
              />
              <Route
                path="/rooms/*"
                element={
                  <RequireAuth authenticated={session.authenticated}>
                    <RoomsHostPage loading={microAppLoading} />
                  </RequireAuth>
                }
              />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </div>

          <section
            className={`shell-micro-app-panel ${isOrdersRoute || isRoomsRoute ? "is-active" : "is-hidden"}`}
            aria-hidden={!isOrdersRoute && !isRoomsRoute}
          >
            <div className="shell-micro-app-panel__header">
              <strong>Micro App Runtime</strong>
              <span>{microAppLoading ? "Loading" : "Mounted"}</span>
            </div>
            <div id="micro-app-slot" className="shell-micro-app-panel__slot" />
          </section>
        </div>
      </div>
    </div>
  );
}
