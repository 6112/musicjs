import { Track } from '../../data/track';
import { MusicApi } from './music-api';

/**
 * A client that can connect & do searches on a Deezer API backend.
 */
export class DeezerApi implements MusicApi {
  /**
   * Search for tracks on Deezer.
   * @param query Track name to search for.
   * @return Promise that resolves with the list of matching albums.
   */
  public async search(query: string): Promise<Track[]> {
    // TODO : implement
    return [];
  }
}
