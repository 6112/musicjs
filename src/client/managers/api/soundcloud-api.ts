import { Track } from '../../data/track';
import { MusicApi } from './music-api';

export class SoundCloudApi implements MusicApi {
  public async search(query: string): Promise<Track[]> {
    // TODO : implement
    return [];
  }
}
