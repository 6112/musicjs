import { Track } from '../data/track';
import { Fetcher } from './api/fetch';

const SEARCH_SERVICE_PORT = 6113;

/**
 * Makes music searches through various APIs.
 */
export class SearchManager {
  /**
   * Constructor. Sets up the music APIs.
   * @param fetcher Fetcher that makes HTTP calls.
   */
  public constructor(private fetcher: Fetcher) {}

  private static getSearchServiceUrl(): string {
    const l = window.location;
    return `${l.protocol}//${l.hostname}:${SEARCH_SERVICE_PORT}`;
  }

  /**
   * Searches the given text on the search service.
   * @param text Text to search.
   * @return A promise containing the list of tracks found.
   */
  public async search(text: string): Promise<Track[]> {
    const encodedQuery = encodeURIComponent(text);
    const url = SearchManager.getSearchServiceUrl() + `/api/search?q=${encodedQuery}`;
    const response = await this.fetcher.fetch(url);
    const json = await response.json();
    return json.map((t: any) => Track.deserialize(t));
  }
}
