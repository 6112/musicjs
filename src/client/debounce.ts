type TimerId = number;
type Callback = () => void;

const debouncers = new Map<string, TimerId>();

export function debounce(callback: Callback, delay: number,
                         debouncerName: string) {
  if (debouncers.has(debouncerName)) {
    window.clearTimeout(debouncers.get(debouncerName));
  }
  const timeout = window.setTimeout(callback, delay);
  debouncers.set(debouncerName, timeout);
}
