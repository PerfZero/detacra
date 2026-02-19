type EnvConfig = {
  authApiUrl: string
  defaultEmail: string
  defaultPassword: string
}

const FALLBACK_AUTH_API_URL = 'https://swiftcore.network/api/lk/auth'

const normalizeUrl = (value?: string) => {
  if (!value) {
    return FALLBACK_AUTH_API_URL
  }

  return value.trim()
}

export const env: EnvConfig = {
  authApiUrl: normalizeUrl(import.meta.env.VITE_AUTH_API_URL),
  defaultEmail: (import.meta.env.VITE_AUTH_DEFAULT_EMAIL ?? '').trim(),
  defaultPassword: import.meta.env.VITE_AUTH_DEFAULT_PASSWORD ?? '',
}
