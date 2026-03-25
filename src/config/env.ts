type EnvConfig = {
  apiBaseUrl: string;
  defaultEmail: string;
  defaultPassword: string;
};

const normalizeBaseUrl = (value?: string) => {
  const url = value?.trim() ?? "https://detectra-d.onedaycrm.ru/api";
  return url.replace(/\/$/, "");
};

export const env: EnvConfig = {
  apiBaseUrl: normalizeBaseUrl(import.meta.env.VITE_API_BASE_URL),
  defaultEmail: (import.meta.env.VITE_AUTH_DEFAULT_EMAIL ?? "").trim(),
  defaultPassword: import.meta.env.VITE_AUTH_DEFAULT_PASSWORD ?? "",
};
