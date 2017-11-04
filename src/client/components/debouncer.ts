type TimerId = number;
type Callback = () => void;

/**
 * Helper class to avoid calling a function too often. For instance, we want to
 * make an API request when the user enters a character in the search field, but
 * we don't want to spam the servers with requests.
 */
export class Debouncer {
  private timer: TimerId = null;

  constructor(private delay: number) {}

  public debounce(callback: Callback) {
    if (this.timer) {
      window.clearTimeout(this.timer);
    }
    this.timer = window.setTimeout(callback, this.delay);
  }
}
