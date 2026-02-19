import type { HttpClient } from "../../shared/http/fetchHttpClient";
import type { AuthApiResponse, LoginCredentials } from "./authTypes";

export interface AuthService {
  login(credentials: LoginCredentials): Promise<string>;
}

const isSuccessResponse = (
  response: AuthApiResponse,
): response is Extract<AuthApiResponse, { result: true }> =>
  response.result === true;

export class ApiAuthService implements AuthService {
  private readonly httpClient: HttpClient;
  private readonly authUrl: string;

  constructor(httpClient: HttpClient, authUrl: string) {
    this.httpClient = httpClient;
    this.authUrl = authUrl;
  }

  async login(credentials: LoginCredentials): Promise<string> {
    const response = await this.httpClient.request<
      AuthApiResponse,
      LoginCredentials
    >({
      method: "POST",
      url: this.authUrl,
      body: credentials,
    });

    if (!isSuccessResponse(response)) {
      throw new Error(response.errorMessage || "Авторизация не удалась");
    }

    if (!response.data.token) {
      throw new Error("Сервер не вернул токен");
    }

    return response.data.token;
  }
}
