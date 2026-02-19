export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

export type HttpRequestOptions<TBody> = {
  method: HttpMethod;
  url: string;
  body?: TBody;
  headers?: Record<string, string>;
};

export interface HttpClient {
  request<TResponse, TBody = unknown>(
    options: HttpRequestOptions<TBody>,
  ): Promise<TResponse>;
}

export class HttpClientError extends Error {
  public readonly status: number;
  public readonly payload: unknown;

  constructor(message: string, status: number, payload: unknown) {
    super(message);
    this.name = "HttpClientError";
    this.status = status;
    this.payload = payload;
  }
}

const parsePayload = async (response: Response) => {
  const contentType = response.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    return response.json();
  }

  return response.text();
};

export class FetchHttpClient implements HttpClient {
  async request<TResponse, TBody = unknown>({
    method,
    url,
    body,
    headers = {},
  }: HttpRequestOptions<TBody>): Promise<TResponse> {
    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: body === undefined ? undefined : JSON.stringify(body),
    });

    const payload = await parsePayload(response);

    if (!response.ok) {
      throw new HttpClientError(
        `Request failed with status ${response.status}`,
        response.status,
        payload,
      );
    }

    return payload as TResponse;
  }
}
