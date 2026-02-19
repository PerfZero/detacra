export type LoginCredentials = {
  email: string
  password: string
}

type AuthApiSuccess = {
  result: true
  data: {
    token: string
  }
  errorMessage?: string
}

type AuthApiFailure = {
  result: false
  data: unknown
  errorMessage: string
}

export type AuthApiResponse = AuthApiSuccess | AuthApiFailure
