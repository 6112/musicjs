import { Track } from '../../data/track';
import { MusicApi } from './music-api';
import { Fetcher } from './fetch';
import { Provider } from '../../data/provider';

/**
 * A client that can connect & do searches on a Jamendo API backend.
 */
export class JamendoApi implements MusicApi {
  /**
   * Application ID used in queries.
   */
  private static APP_ID =  'f80af01b';

  /**
   * Search URL.
   */
  private static SEARCH_URL = 'https://api.jamendo.com/v3.0/tracks';

  /**
   * Transform an API response into a list of tracks.
   * @param json API response.
   * @return List of tracks.
   */
  private static deserialize(json: SearchResponse): Track[] {
    return json.results.map((track: RawTrack) =>
      new Track(track.name, track.artist_name, track.duration, track.audio, Provider.JAMENDO)
    );
  }

  /**
   * Constructor.
   * @param fetcher Fetcher used to make queries.
   */
  public constructor(private fetcher: Fetcher) { }

  /**
   * Search for tracks on Jamendo.
   * @param query Track name to search for.
   * @return Promise that resolves with the list of matching albums.
   */
  public async search(query: string): Promise<Track[]> {
    const encodedQuery = encodeURIComponent(query);
    const url = `${JamendoApi.SEARCH_URL}?client_id=${JamendoApi.APP_ID}&search=${encodedQuery}`;
    const response = await this.fetcher.fetch(url);
    const json = await response.json();
    return JamendoApi.deserialize(json as SearchResponse);
  }
}

/**
 * Search response returned by the API.
 */
interface SearchResponse {
  results: RawTrack[];
}

/**
 * Track returned by the API.
 */
interface RawTrack {
  name: string;
  artist_name: string;
  duration: number;
  audio: string;
}
