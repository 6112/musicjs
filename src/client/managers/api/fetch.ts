export interface Fetcher {
  /**
   * Fetch a resource over HTTPS, optionally with an API token.
   *
   * API-compatible with the native fetch() function.
   *
   * @param url URL of the resource to fetch.
   * @param init Options object with custom settings.
   * @param authToken Authorization token if the endpoint requires one.
   */
  fetch(url: string, init?: RequestInit, authToken?: string): Promise<Response>;
}

/**
 * Class for fetching values over HTTP.
 *
 * See:
 * https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
 */
export class FetchApiFetcher implements Fetcher {
  /**
   * Fetch a resource over HTTP.
   * @param url URL of the resource to fetch.
   * @param init Options object with custom settings.
   * @param authToken Authorization token if the endpoint requires one.
   */
  // tslint:disable-next-line:prefer-function-over-method
  public async fetch(url: string, init?: RequestInit, authToken?: string): Promise<Response> {
    const request = new Request(url, init);
    if (authToken) {
      request.headers.set('Authorization', `Bearer ${authToken}`);
    }
    return fetch(request);
  }
}

/**
 * Stub of the `Fetcher` class for unit testing.
 */
export class MockFetcher implements Fetcher {
  /**
   * Response queue.
   */
  private responses: Response[] = [];

  /**
   * Mocks a HTTP fetch and returns a Response from the response queue.
   * Returns a 500 Response if the queue is empty.
   * @param url unused.
   * @param init unused.
   * @param authToken unused.
   */
  public async fetch(url: string, init?: RequestInit, authToken?: string): Promise<Response> {
    if (this.responses.length !== 0) {
      return this.responses.shift();
    }
    return new Response('Error 500 - Internal server error', {
      status: 500,
      statusText: 'Internal Server Error'
    });
  }

  /**
   * Pushes a response to the reponse queue.
   * @param response Response to push.
   */
  public pushResponse(response: Response) {
    this.responses.push(response);
  }
}
