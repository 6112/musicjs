import { Track } from '../../data/track';

/**
 * A client that can connect & do searches on a music API backend.
 */
export interface MusicApi {
  /**
   * Search for tracks on the music API backend.
   *
   * @param query Track name to search for.
   * @return Promise that resolves with the list of matching albums.
   */
  search(query: string): Promise<Track[]>;
}
