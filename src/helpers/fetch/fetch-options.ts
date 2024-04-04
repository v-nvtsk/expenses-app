type Options = {
  method: string;
  headers?: { [key: string]: any };
  body?: string;
};

// eslint-disable-next-line @typescript-eslint/default-param-last
export function createFetchOptions(method?: string, headers?: { [key: string]: any } | null, data?: any) {
  const options: Options = {
    method: method || "GET",
  };
  if (headers) options.headers = headers;
  if (method && method !== "GET") {
    options.headers = options.headers || { "Content-Type": "application/json" };
    options.body = JSON.stringify(data);
  }

  return options;
}
