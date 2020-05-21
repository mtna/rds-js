import { HttpResponse } from '../models/http-response';

/**
 * Utility to make strongly typed HTTP requests.
 * Uses the Fetch API.
 */
export class HttpUtil {
  /**
   * Utility function to make a fully typed
   * http request with the fetch API.
   *
   * @example
   * const response = await HttpUtil.request<Todo[]>(
   *  "https://jsonplaceholder.typicode.com/todos"
   * );
   *
   * @param req This Fetch API interface represents a resource request.
   * @returns a typed async http reponse
   */
  static async request<T>(req: RequestInfo): Promise<HttpResponse<T>> {
    const response: HttpResponse<T> = await fetch(req);

    try {
      // catch the error if there is no body
      response.parsedBody = (await response.json()) as T;
    } catch (ex) {
      throw new Error(`[@rds/sdk](HttpUtil.request): Failed to parse response as JSON`);
    }

    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return response;
  }

  /**
   * Make a strongly typed http GET request.
   *
   * @example
   * const response = await HttpUtil.get<{ id: number }>(
   *   "https://jsonplaceholder.typicode.com/posts"
   * );
   *
   * @param path url for the request
   * @param args fetch API args, defaults to `{ method: 'get' }`
   * @returns a typed async http reponse
   */
  static async get<T>(path: string, args: RequestInit = { method: 'get' }): Promise<HttpResponse<T>> {
    return this.request<T>(new Request(path, args));
  }

  /**
   * Make a strongly typed http POST request.
   *
   * @example
   * const response = await HttpUtil.post<{ id: number }>(
   *   "https://jsonplaceholder.typicode.com/posts",
   *   { title: "my post", body: "some content" }
   * );
   *
   * @param path url for the request
   * @param body request's body
   * @param args fetch API args, defaults to `{ method: 'post', body: JSON.stringify(body) }`
   * @returns a typed async http reponse
   */
  static async post<T>(
    path: string,
    body: any,
    args: RequestInit = { method: 'post', body: JSON.stringify(body) }
  ): Promise<HttpResponse<T>> {
    return this.request<T>(new Request(path, args));
  }

  /**
   * Make a strongly typed http PUT request.
   *
   * @example
   * const response = await HttpUtil.put<{ id: number }>(
   *   "https://jsonplaceholder.typicode.com/posts",
   *   { title: "my post", body: "some content" }
   * );
   *
   * @param path url for the request
   * @param body request's body
   * @param args fetch API args, defaults to `{ method: 'put', body: JSON.stringify(body) }`
   * @returns a typed async http reponse
   */
  static async put<T>(
    path: string,
    body: any,
    args: RequestInit = { method: 'put', body: JSON.stringify(body) }
  ): Promise<HttpResponse<T>> {
    return this.request<T>(new Request(path, args));
  }
}
