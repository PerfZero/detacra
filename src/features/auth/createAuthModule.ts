import { env } from '../../config/env'
import { FetchHttpClient } from '../../shared/http/fetchHttpClient'
import { ApiAuthService } from './authService'
import { BrowserTokenStorage } from './tokenStorage'

export const createAuthModule = () => {
  const httpClient = new FetchHttpClient()

  return {
    authService: new ApiAuthService(httpClient, env.authApiUrl),
    tokenStorage: new BrowserTokenStorage(),
  }
}
