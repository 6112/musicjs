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
  private static instance: SpotifyClient = undefined

  private constructor() {}

  /**
   * Return a singleton instance of this.
   */
  static getInstance() {
    if (!SpotifyClient.instance)
      SpotifyClient.instance = new SpotifyClient()
    return SpotifyClient.instance
  }

  /**
   * Search for tracks on Spotify.
   *
   * @param query Track name to search for.
   * @return Promise that resolves with the list of matching albums.
   */
  search(query: string): Promise<Track[]> {
    const encodedQuery = encodeURIComponent(query)
    const url = `${SEARCH_URL}?q=${encodedQuery}&type=track`
    return (
      this.fetch(url)
        .then((r: Response) => r.json())
        .then((json: SearchResponse) => this.deserialize(json)))
  }

  /**
   * Fetch a resource from the Spotify over HTTPS, giving an API token.
   *
   * See:
   * https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
   *
   * @param url URL of the resource to fetch.
   */
  private fetch(url: string): Promise<Response> {
    return (
      SpotifyTokenManager.getInstance().getToken()
        .then((token: string) => {
          return fetch(url, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
        }))
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
class SpotifyTokenManager {
  private token: string = undefined

  private static instance: SpotifyTokenManager = undefined

  private constructor() {}

  static getInstance() {
    if (!SpotifyTokenManager.instance)
      SpotifyTokenManager.instance = new SpotifyTokenManager()
    return SpotifyTokenManager.instance
  }

  getToken(): Promise<string> {
    if (this.token)
      // TODO: refresh token if it's expired
      return Promise.resolve(this.token)
    return this.refreshToken()
  }

  refreshToken(): Promise<string> {
    return (
      fetch("/spotify_auth_token")
        .then((r: Response) => r.text())
        .then((token: string) => {
          this.token = token
          return token
        }))
  }
}
