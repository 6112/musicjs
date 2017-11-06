import { Track } from '../../data/track';
import { Provider } from '../../data/provider';
import { Fetcher } from './fetch';
import { MusicApi } from './music-api';

const SEARCH_URL = 'https://api.spotify.com/v1/search';

/**
 * Number of milliseconds in a second.
 */
const MS_PER_SECOND = 1000;

/**
 * A client that can connect & do searches on a Spotify API backend.
 */
export class SpotifyApi implements MusicApi {
  /**
   * Deserialize a SearchResponse object.
   */
  private static deserialize(json: SearchResponse): Track[] {
    return json.tracks.items.map((t) =>
      new Track(t.name,
                t.artists[0].name,
                t.album.name,
                Math.round(t.duration_ms / MS_PER_SECOND),
                t.external_urls.spotify,
                Provider.SPOTIFY));
  }

  /**
   * Default constructor.
   */
  public constructor(private fetcher: Fetcher,
                     private tokenManager: SpotifyTokenManager) {
  }

  /**
   * Search for tracks on Spotify.
   * @param query Track name to search for.
   * @return Promise that resolves with the list of matching albums.
   */
  public async search(query: string): Promise<Track[]> {
    const encodedQuery = encodeURIComponent(query);
    const url = `${SEARCH_URL}?q=${encodedQuery}&type=track`;
    const authToken = await this.tokenManager.getToken();
    const response = await this.fetcher.fetch(url, {}, authToken);
    const json = await response.json();
    return SpotifyApi.deserialize(json as SearchResponse);
  }
}

/**
 * Response sent by the Spotify API for a search request.
 *
 * https://developer.spotify.com/web-api/search-item/
 */
interface SearchResponse {
  tracks: TrackList;
}

interface TrackList {
  items: RawTrack[];
}

/**
 * Raw Track object returned by the Spotify API.
 */
interface RawTrack {
  id: string;
  name: string;
  artists: Artist[];
  album: Album;
  duration_ms: number;
  external_urls: ExternalUrl;   // For opening in a new tab
  uri: string;                  // For opening in the 'native' spotify app
}

/**
 * List of external URLs to refer to a resource (artist, track, album...) in the
 * Spotify API.
 */
interface ExternalUrl {
  spotify: string;               // Link to the resource on spotify.com
}

/**
 * Raw (simplified) Artist object returned by the Spotify API.
 */
interface Artist {
  id: string;
  name: string;
  external_urls: ExternalUrl;
}

/**
 * Raw (simplified) Album object returned by the Spotify API.
 */
interface Album {
  id: string;
  name: string;
  external_urls: ExternalUrl;
  images: Image[];
}

/**
 * Image object returned by the Spotify API.
 */
interface Image {
  height: number;
  width: number;
  url: string;
}

/**
 * Manages an API token and automatically refreshes it when needed. Singleton.
 */
export class SpotifyTokenManager {
  /**
   * Auth token from the HTTP server.
   */
  private token: string = undefined;

  /**
   * Return an auth token that can be used when making requests to the Spotify
   * API.
   */
  public async getToken(): Promise<string> {
    if (this.token) {
      // TODO: refresh token if it's expired
      return this.token;
    }
    return this.refreshToken();
  }

  /**
   * Refresh the auth token if it's expired.
   */
  public async refreshToken(): Promise<string> {
    const response = await fetch('/spotify_auth_token');
    this.token = await response.text();
    return this.token;
  }
}
