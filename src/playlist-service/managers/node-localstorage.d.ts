/**
 * Minimal type definition for node-localstorage.
 */
declare module 'node-localstorage' {
  class LocalStorage {
    constructor(file: string);
    getItem(key: string): string;
    setItem(key: string, value: string | number): void;
  }
}
