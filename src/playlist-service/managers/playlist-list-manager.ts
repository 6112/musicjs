import { LocalStorage } from 'node-localstorage';

const localStorage = new LocalStorage('./.localstorage');

/**
 * Manages a database in which each element is a list of playlists. Uses
 * localStorage for persistency.
 */
export class PlaylistListManager {
  /**
   * Generate a unique ID for use in the database.
   */
  private static generateUid(): number {
    const uid = parseInt(localStorage.getItem('uid')) || 1;
    localStorage.setItem('uid', uid + 1);
    return uid;
  }

  /**
   * Create a new entry in the database.
   * @param playlists Value to save in the database.
   * @return Unique ID that can be used to update or read from the new entry.
   */
  public static create(playlists: string[]): number {
    const id = PlaylistListManager.generateUid();
    localStorage.setItem(id + '', JSON.stringify(playlists));
    return id;
  }

  /**
   * Read, parse, and return an entry from the database.
   * @param id Unique ID of the entry to retrieve.
   * @return The value saved in the database.
   */
  public static read(id: number): string[] {
    return JSON.parse(localStorage.getItem(id + ''));
  }

  /**
   * Update an existing entry in the database.
   * @param id Unique ID of the entry to update.
   * @param playlists New value to use in the database.
   */
  public static update(id: number, playlists: string[]): void {
    localStorage.setItem(id + '', JSON.stringify(playlists));
  }
}
