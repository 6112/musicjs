import { Track } from '../../data/track';
import { MusicApi } from './music-api';

export class DeezerApi implements MusicApi {
  public async search(query: string): Promise<Track[]> {
    // TODO : implement
    return [];
  }
}
