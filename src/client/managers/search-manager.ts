import { Track } from '../data/track';
import { SpotifyApi, SpotifyTokenManager } from './api/spotify-api';
import { SoundCloudApi } from './api/soundcloud-api';
import { DeezerApi } from './api/deezer-api';
import { Fetcher } from './api/fetch';

/**
 * Makes music searches through various APIs.
 */
export class SearchManager {
  /**
   * Spotify API.
   */
  private spotifyApi: SpotifyApi;

  /**
   * SoundCloud API.
   */
  private soundcloudApi: SoundCloudApi;

  /**
   * Deezer API.
   */
  private deezerApi: DeezerApi;

  /**
   * Constructor. Sets up the music APIs.
   * @param fetcher Fetcher that makes HTTP calls.
   * @param tokenManager Token manager for Spotify.
   */
  public constructor(fetcher: Fetcher, tokenManager: SpotifyTokenManager) {
    this.spotifyApi = new SpotifyApi(fetcher, tokenManager);
    this.soundcloudApi = new SoundCloudApi();
    this.deezerApi = new DeezerApi();
  }

  /**
   * Searches the given text on various music services.
   * @param text Text to search.
   * @return A promise containing the list of tracks found.
   */
  public async search(text: string): Promise<Track[]> {
    const spotify = this.spotifyApi.search(text);
    const soundcloud = this.soundcloudApi.search(text);
    const deezer = this.deezerApi.search(text);
    const results = await Promise.all([spotify, soundcloud, deezer]);
    return [].concat.apply([], results) as Track[];
  }
}
