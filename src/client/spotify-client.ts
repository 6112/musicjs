import { Fetcher } from "./fetch"
import { Track } from "./track"
import { MusicApiClient } from "./music-api-client"

const CLIENT_ID = "af1d0f4923bc4391a7bcd1f14f66a051"
const CLIENT_SECRET = "e281a32169f54b0685179322910ceca2"

const API_TOKEN_URL = "https://accounts.spotify.com/api/token"
const SEARCH_URL = "https://api.spotify.com/v1/search"

/**
 * A client that can connect & do searches on a Spotify API backend. Singleton.
 */
export class SpotifyClient implements MusicApiClient {
  /**
   * Default constructor.
   */
  constructor(private fetcher: Fetcher,
              private tokenManager: SpotifyTokenManager) {
  }

  /**
   * Search for tracks on Spotify.
   *
   * @param query Track name to search for.
   * @return Promise that resolves with the list of matching albums.
   */
  async search(query: string): Promise<Track[]> {
    const encodedQuery = encodeURIComponent(query)
    const url = `${SEARCH_URL}?q=${encodedQuery}&type=track`
    const authToken = await this.tokenManager.getToken()
    const response = await this.fetcher.fetch(url, {}, authToken)
    const json = await response.json()
    return this.deserialize(json as SearchResponse)
  }

  /**
   * Deserialize a SearchResponse object.
   */
  private deserialize(json: SearchResponse): Track[] {
    return json.tracks.items.map(t => new Track(t.name))
  }
}

/**
 * Response sent by the Spotify API for a search request.
 */
interface SearchResponse {
  tracks: TrackList
}

interface TrackList {
  items: RawTrack[]
}

/**
 * Raw Track object returned by the Spotify API.
 */
interface RawTrack {
  name: string
}

/**
 * Manages an API token and automatically refreshes it when needed. Singleton.
 */
export class SpotifyTokenManager {
  private token: string = undefined

  getToken(): Promise<string> {
    if (this.token)
      // TODO: refresh token if it's expired
      return Promise.resolve(this.token)
    return this.refreshToken()
  }

  async refreshToken(): Promise<string> {
    const response = await fetch("/spotify_auth_token")
    this.token = await response.text()
    return this.token
  }
}
