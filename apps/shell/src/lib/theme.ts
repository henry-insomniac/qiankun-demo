export const THEME_STORAGE_KEY = "qiankun-demo.theme";

export const THEMES = [
  { id: "tech", name: "企业蓝", color: "#2563eb" },
  { id: "dark", name: "极夜黑", color: "#09090b" },
  { id: "dark-one", name: "深邃黑", color: "#282c34" },
  { id: "business", name: "事务金", color: "#c28100" },
  { id: "mint", name: "薄荷绿", color: "#059669" },
  { id: "sunset", name: "晚霞橙", color: "#ea580c" },
  { id: "grape", name: "葡萄灰紫", color: "#7c3aed" },
  { id: "ocean", name: "海湾青", color: "#0284c7" },
  { id: "forest", name: "松林绿", color: "#166534" },
  { id: "rose", name: "玫瑰粉", color: "#db2777" },
  { id: "slate", name: "石板灰", color: "#475569" },
  { id: "aurora", name: "极光青", color: "#0d9488" },
] as const;

export type ThemeId = (typeof THEMES)[number]["id"];

export const themeIds = THEMES.map((t) => t.id);

export const DEFAULT_THEME: ThemeId = "tech";

export function normalizeTheme(value: string | null | undefined): ThemeId {
  const normalized = THEMES.find((t) => t.id === value);
  return normalized?.id ?? DEFAULT_THEME;
}

export function applyTheme(themeId: ThemeId): void {
  if (typeof document !== "undefined") {
    document.documentElement.setAttribute("data-theme", themeId);
  }
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, themeId);
    } catch {}
  }
}

export const themeInitScript = `(() => {
  try {
    var raw = window.localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)});
    var theme = ${JSON.stringify(DEFAULT_THEME)};
    var validThemes = ${JSON.stringify(THEMES.map((t) => t.id))};
    if (raw && validThemes.includes(raw)) {
      theme = raw;
    }
    document.documentElement.setAttribute("data-theme", theme);
  } catch (_error) {
    document.documentElement.setAttribute("data-theme", ${JSON.stringify(DEFAULT_THEME)});
  }
})();`;
