import * as fetch from 'node-fetch';

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
                t.preview_url,
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
  preview_url: string;
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

const CLIENT_ID = 'af1d0f4923bc4391a7bcd1f14f66a051';
const CLIENT_SECRET = 'e281a32169f54b0685179322910ceca2';

const API_TOKEN_URL = 'https://accounts.spotify.com/api/token';

export class SpotifyTokenManager {
  private authToken: string = null;

  private fetchAuthToken(): Promise<string> {
    const base64ClientInfo = new Buffer(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');
    return fetch(API_TOKEN_URL, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${base64ClientInfo}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'grant_type=client_credentials'
    }).then((response) => response.json())
      .then((json) => {
        if (json.error) {
          return Promise.reject(new Error(json.error));
        }
        this.authToken = json.access_token;
        // refresh token when it expires
        setTimeout(this.fetchAuthToken.bind(this), json.expires_in * 1000);
        return this.authToken;
      });
  }

  public getToken(): Promise<string> {
    if (this.authToken) {
      return Promise.resolve(this.authToken);
    }
    return this.fetchAuthToken();
  }
}
