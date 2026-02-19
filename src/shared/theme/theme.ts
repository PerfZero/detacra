export type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "detectra-theme";

const isTheme = (value: string | null): value is Theme =>
  value === "light" || value === "dark";

export const resolveInitialTheme = (): Theme => {
  if (typeof window === "undefined") {
    return "dark";
  }

  const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);

  if (isTheme(storedTheme)) {
    return storedTheme;
  }

  return "dark";
};

export const applyTheme = (theme: Theme) => {
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  root.style.colorScheme = theme;
  window.localStorage.setItem(THEME_STORAGE_KEY, theme);
};
