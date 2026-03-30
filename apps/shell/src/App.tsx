import { useEffect, useState } from "react";
import { NavLink, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useTheme } from "next-themes";

import { createMockAuthClient } from "@qiankun-demo/auth-sdk";
import type { PlatformGlobalState } from "@qiankun-demo/contracts";
import { TOKENS_VERSION } from "@qiankun-demo/design-tokens";
import { THEMES } from "./lib/theme";

import { bootstrapQiankun } from "./platform/bootstrapQiankun";
import {
  findPlatformAppByPath,
  isEmbeddedPlatformApp,
  platformApps,
  type EmbeddedPlatformApp,
  type PlatformApp,
} from "./platform/catalog";
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
      <h1>统一基座已切到真实系统接入模式</h1>
      <p>
        当前 shell 保留一个 qiankun 样板微应用用于契约验证，同时把 4
        个现有系统接到统一导航下。样板间继续承担生命周期和主题联调职责，其余业务入口走存量系统兼容接入。
      </p>
      <div className="shell-grid">
        {platformApps.map((app) => (
          <article key={app.id} className="shell-grid__app-card">
            <div className="shell-grid__app-card-head">
              <span className="shell-badge shell-badge--subtle">
                {app.integrationLabel}
              </span>
              <h2>{app.title}</h2>
            </div>
            <p>{app.summary}</p>
            <div className="shell-grid__app-card-meta">
              <span>{app.routePath}</span>
              <NavLink className="shell-inline-link" to={app.routePath}>
                进入系统
              </NavLink>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function LoginPage({ onLogin }: { onLogin: () => Promise<void> }) {
  return (
    <section className="shell-page-card shell-page-card--compact">
      <span className="shell-badge">Auth Facade</span>
      <h1>登录页</h1>
      <p>第一版继续用 mock 会话模拟统一账号能力，后续替换成真实 IdP 即可。</p>
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
      <p>这是 shell 自己的页面，用来验证“shell 原生页面”和“外部系统入口”可以共存。</p>
    </section>
  );
}

function AppRoutePage({ app }: { app: PlatformApp }) {
  return (
    <section className="shell-page-card shell-page-card--micro-brief">
      <div className="shell-page-card__intro">
        <span className="shell-badge">{app.integrationLabel}</span>
        <h1>{app.title}</h1>
        <p>{app.summary}</p>
      </div>
      <div className="shell-page-card__status">
        <span className="shell-page-card__status-label">加载状态</span>
        <strong>已就绪</strong>
        {isEmbeddedPlatformApp(app) ? (
          <span className="shell-page-card__status-meta">{app.sourceUrl}</span>
        ) : null}
      </div>
    </section>
  );
}

function EmbeddedAppFrame({
  app,
}: {
  app: EmbeddedPlatformApp;
}) {
  return (
    <iframe
      key={app.id}
      className="shell-embedded-app-frame"
      title={app.title}
      src={app.embedUrl}
    />
  );
}

function NotFoundPage() {
  return (
    <section className="shell-page-card shell-page-card--compact">
      <span className="shell-badge">404</span>
      <h1>页面不存在</h1>
      <p>Shell 保留全局 404，微应用或存量系统只处理自己入口下的路径。</p>
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

interface ThemePanelProps {
  isOpen: boolean;
  onClose: () => void;
  onThemeSelect: (themeId: string) => void;
  currentThemeName: string;
  activePlatformApp: PlatformApp | null;
  authenticated: boolean;
  onLogout: () => Promise<void>;
}

function ThemePanel({
  isOpen,
  onClose,
  onThemeSelect,
  currentThemeName,
  activePlatformApp,
  authenticated,
  onLogout,
}: ThemePanelProps) {
  const { theme } = useTheme();

  if (!isOpen) return null;

  function handleThemeSelect(themeId: string) {
    onThemeSelect(themeId);
    onClose();
  }

  return (
    <>
      <div className="theme-panel__backdrop" onClick={onClose} />
      <div className="theme-panel">
        <div className="theme-panel__header">
          <div className="theme-panel__title-block">
            <h3>系统设置</h3>
            <p>所有运行态配置统一收敛到这里。</p>
          </div>
          <button className="theme-panel__close" onClick={onClose} type="button">
            ×
          </button>
        </div>
        <div className="theme-panel__section">
          <div className="theme-panel__section-head">
            <strong>主题</strong>
            <span>当前：{currentThemeName}</span>
          </div>
          <p className="theme-panel__desc">选择壳层配色，不占用系统运行区顶部空间。</p>
        </div>
        <div className="theme-panel__grid">
          {THEMES.map((item) => (
            <button
              key={item.id}
              className={`theme-panel__item ${theme === item.id ? "is-active" : ""}`}
              onClick={() => handleThemeSelect(item.id)}
              type="button"
            >
              <div
                className="theme-panel__color"
                style={{ backgroundColor: item.color }}
              />
              <span className="theme-panel__name">{item.name}</span>
              {theme === item.id ? (
                <span className="theme-panel__check">✓</span>
              ) : null}
            </button>
          ))}
        </div>
        <div className="theme-panel__section theme-panel__section--ops">
          <div className="theme-panel__section-head">
            <strong>运行操作</strong>
            <span>{activePlatformApp ? activePlatformApp.title : "未选择系统"}</span>
          </div>
          <div className="theme-panel__ops">
            {activePlatformApp ? (
              <a
                className="shell-button shell-button--ghost theme-panel__op"
                href={activePlatformApp.standaloneUrl}
                target="_blank"
                rel="noreferrer"
              >
                独立打开当前系统
              </a>
            ) : null}
            {authenticated ? (
              <button
                className="shell-button theme-panel__op"
                onClick={() => void onLogout()}
                type="button"
              >
                退出登录
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
}

export default function App() {
  const location = useLocation();
  const { theme, setTheme } = useTheme();
  const [session, setSession] = useState(authClient.getSession());
  const [platformState, setPlatformState] =
    useState<PlatformGlobalState>(initialPlatformState);
  const [themePanelOpen, setThemePanelOpen] = useState(false);
  const [themeRipple, setThemeRipple] = useState<{
    x: number;
    y: number;
    color: string;
  } | null>(null);

  const activePlatformApp = findPlatformAppByPath(location.pathname);
  const showAppPanel = Boolean(activePlatformApp) && session.authenticated;
  const activeEmbeddedApp =
    showAppPanel && activePlatformApp && isEmbeddedPlatformApp(activePlatformApp)
      ? activePlatformApp
      : null;

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

  const currentThemeName = THEMES.find((item) => item.id === theme)?.name || theme;

  function handleThemeSelectWithRipple(themeId: string) {
    const selectedTheme = THEMES.find((item) => item.id === themeId);
    const color = selectedTheme?.color || "#2563eb";
    setThemeRipple({
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      color,
    });
    setTimeout(() => {
      setThemeRipple(null);
      setTheme(themeId);
    }, 400);
  }

  return (
    <div
      className={`shell shell--theme-${theme} ${showAppPanel ? "shell--app-route" : ""}`}
    >
      <aside className="shell-sidebar">
        <div className="shell-sidebar__brand">
          <span className="shell-badge">qiankun</span>
          <strong>Platform Shell</strong>
        </div>
        <nav className="shell-sidebar__nav">
          <NavLink to="/">总览</NavLink>
          {platformApps.map((app) => (
            <NavLink key={app.id} to={app.routePath}>
              {app.navLabel}
            </NavLink>
          ))}
          <NavLink to="/profile">个人中心</NavLink>
        </nav>
        <div className="shell-sidebar__footer">
          <div className="shell-sidebar__meta">
            <span>Tenant: {platformState.tenantId}</span>
            <span>Locale: {platformState.locale}</span>
            <span>Trace: {shellTelemetry.traceId().slice(0, 18)}...</span>
          </div>
          <button
            className="shell-button shell-button--ghost shell-sidebar__settings"
            onClick={() => setThemePanelOpen(true)}
            type="button"
          >
            系统设置
          </button>
        </div>
      </aside>

      <div className={`shell-main ${showAppPanel ? "shell-main--app-route" : ""}`}>
        {!showAppPanel ? (
          <header className="shell-header">
            <div>
              <p className="shell-header__eyebrow">Production-ready shell</p>
              <h1>统一入口、统一契约、统一接入面</h1>
            </div>
            {!session.authenticated ? (
              <div className="shell-header__actions">
                <button className="shell-button" onClick={() => void handleLogin()}>
                  登录
                </button>
              </div>
            ) : null}
          </header>
        ) : null}

        <div
          className={`shell-main__body ${showAppPanel ? "shell-main__body--micro-route" : ""}`}
        >
          <div
            className={`shell-main__content ${showAppPanel ? "shell-main__content--micro-route" : ""}`}
          >
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
              {platformApps.map((app) => (
                <Route
                  key={app.id}
                  path={`${app.routePath}/*`}
                  element={
                    <RequireAuth authenticated={session.authenticated}>
                      <AppRoutePage app={app} />
                    </RequireAuth>
                  }
                />
              ))}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </div>

          <section
            className={`shell-micro-app-panel ${showAppPanel ? "is-active shell-micro-app-panel--micro-route" : "is-hidden"}`}
            aria-hidden={!showAppPanel}
          >
            {showAppPanel && activePlatformApp ? (
              <div id="micro-app-slot" className="shell-micro-app-panel__slot">
                {activeEmbeddedApp ? (
                  <EmbeddedAppFrame app={activeEmbeddedApp} />
                ) : null}
              </div>
            ) : (
              <div id="micro-app-slot" className="shell-micro-app-panel__slot" />
            )}
          </section>
        </div>
      </div>

      <ThemePanel
        isOpen={themePanelOpen}
        onClose={() => setThemePanelOpen(false)}
        onThemeSelect={handleThemeSelectWithRipple}
        currentThemeName={currentThemeName}
        activePlatformApp={activePlatformApp}
        authenticated={session.authenticated}
        onLogout={handleLogout}
      />
      {themeRipple ? (
        <div
          className="theme-ripple"
          style={{
            left: themeRipple.x,
            top: themeRipple.y,
            backgroundColor: themeRipple.color,
          }}
        />
      ) : null}
    </div>
  );
}
