import { Track } from '../../data/track';
import { MusicApi } from './music-api';
import { Fetcher } from './fetch';
import { Provider } from '../../data/provider';

/**
 * A client that can connect & do searches on a Deezer API backend.
 */
export class DeezerApi implements MusicApi {
  /**
   * URL to use for searching.
   */
  private static SEARCH_URL = '/deezer_search';

  /**
   * Transform a response from the API to a list of tracks.
   * @param json API response.
   * @return List of tracks.
   */
  private static deserialize(json: SearchResponse): Track[] {
    return json.data.map((track: RawTrack) =>
      new Track(track.title, track.artist.name, track.album.title, track.duration, track.preview, Provider.DEEZER)
    );
  }

  /**
   * Constructor
   * @param fetcher Fetcher used to make requests.
   */
  public constructor(private fetcher: Fetcher) { }

  /**
   * Search for tracks on Deezer.
   * @param query Track name to search for.
   * @return Promise that resolves with the list of matching albums.
   */
  public async search(query: string): Promise<Track[]> {
    const encodedQuery = encodeURIComponent(query);
    const url = `${DeezerApi.SEARCH_URL}?text=${encodedQuery}`;
    const response = await this.fetcher.fetch(url);
    const json = await response.json();
    return DeezerApi.deserialize(json as SearchResponse);
  }
}

/**
 * Response sent by the Deezer API for a search request.
 */
interface SearchResponse {
  data: RawTrack[];
}

/**
 * Track object sent by the Deezer API.
 */
interface RawTrack {
  title: string;
  preview: string;
  artist: Artist;
  album: Album;
  duration: number;
}

/**
 * Artist object sent by the Deezer API.
 */
interface Artist {
  name: string;
}

/**
 * Album object sent by the Deezer API.
 */
interface Album {
  title: string;
}
