export interface TokenStorage {
  getToken(): string | null
  saveToken(token: string, persistent: boolean): void
  clearToken(): void
}

const TOKEN_STORAGE_KEY = 'detectra_auth_token'

export class BrowserTokenStorage implements TokenStorage {
  getToken(): string | null {
    return localStorage.getItem(TOKEN_STORAGE_KEY) ?? sessionStorage.getItem(TOKEN_STORAGE_KEY)
  }

  saveToken(token: string, persistent: boolean): void {
    if (persistent) {
      localStorage.setItem(TOKEN_STORAGE_KEY, token)
      sessionStorage.removeItem(TOKEN_STORAGE_KEY)
      return
    }

    sessionStorage.setItem(TOKEN_STORAGE_KEY, token)
    localStorage.removeItem(TOKEN_STORAGE_KEY)
  }

  clearToken(): void {
    localStorage.removeItem(TOKEN_STORAGE_KEY)
    sessionStorage.removeItem(TOKEN_STORAGE_KEY)
  }
}
