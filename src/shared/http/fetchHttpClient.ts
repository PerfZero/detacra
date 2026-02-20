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
    try {
      return await response.json();
    } catch {
      return null;
    }
  }

  try {
    return await response.text();
  } catch {
    return null;
  }
};

const resolveErrorMessage = (status: number, payload: unknown) => {
  if (payload && typeof payload === "object") {
    const record = payload as Record<string, unknown>;
    const apiErrorMessage = record.errorMessage;
    const message = record.message;

    if (typeof apiErrorMessage === "string" && apiErrorMessage.trim()) {
      return apiErrorMessage;
    }

    if (typeof message === "string" && message.trim()) {
      return message;
    }
  }

  if (typeof payload === "string" && payload.trim()) {
    return payload;
  }

  return `Request failed with status ${status}`;
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
        resolveErrorMessage(response.status, payload),
        response.status,
        payload,
      );
    }

    return payload as TResponse;
  }
}
