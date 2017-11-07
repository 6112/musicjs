type Callback = () => void;

/**
 * Helper class to avoid calling a function too often. For instance, we want to
 * make an API request when the user enters a character in the search field, but
 * we don't want to spam the servers with requests.
 */
export class Debouncer {
  /**
   * Current timeout.
   */
  private timer: number = null;

  /**
   * Constructor.
   * @param delay Amount of time to wait, in milliseconds.
   */
  public constructor(private delay: number) {}

  /**
   * Debounces the callback for a certain time.
   * @param callback Function called after the debounce.
   */
  public debounce(callback: Callback): void {
    if (this.timer) {
      window.clearTimeout(this.timer);
    }
    this.timer = window.setTimeout(callback, this.delay);
  }
}
