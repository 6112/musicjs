import { Track } from '../data/track';
import { FetchApiFetcher } from '../managers/api/fetch';
import { SpotifyTokenManager } from '../managers/api/spotify-api';
import { SearchManager } from '../managers/search-manager';
import { BaseComponent } from './component';
import { Debouncer } from './debouncer';

/**
 * UI Component for searching tracks and displaying the list of results.
 */
export class SearchComponent extends BaseComponent {
  /**
   * Template for the search results.
   */
  private static trackListTemplate = Handlebars.compile(
    document.getElementById('track-list-template').innerHTML);

  /**
   * Number of milliseconds of debounce.
   */
  private static DEBOUNCE_TIME = 300;

  /**
   * Renders the list of tracks found.
   * @param tracks List of tracks found.
   */
  private static renderTrackList(tracks: Track[]) {
    return SearchComponent.trackListTemplate({ tracks });
  }

  /**
   * Debouncer used to debounce the results.
   */
  private searchDebouncer = new Debouncer(SearchComponent.DEBOUNCE_TIME);

  /**
   * UI for the input of the search.
   */
  private searchInput: HTMLInputElement;

  /**
   * UI for the search results.
   */
  private searchResults: HTMLElement;

  /**
   * Used to make searches.
   */
  private searchManager: SearchManager;

  public constructor() {
    super('search', 'Recherche');
    this.searchInput = document.getElementById('search-input') as HTMLInputElement;
    this.searchInput.addEventListener('input', () => {
      this.onSearchInput();
    });

    this.searchResults = document.getElementById('search-results');

    const fetcher = new FetchApiFetcher();
    const spotifyTokenManager = new SpotifyTokenManager();
    this.searchManager = new SearchManager(fetcher, spotifyTokenManager);

    this.searchResults.innerHTML = SearchComponent.renderTrackList([]);
  }

  /**
   * Searchs music with the entered input, then displays the results.
   */
  private async debouncedSearch(): Promise<void> {
    const val = this.searchInput.value;
    if (!val || !/\S/.test(val)) {
      // Search field empty. Nothing to do.
    } else {
      const tracks = await this.searchManager.search(val);
      this.searchResults.innerHTML = SearchComponent.renderTrackList(tracks);
    }
  }

  /**
   * Called when the input changes. Debounces the search call.
   */
  private onSearchInput(): void {
    this.searchDebouncer.debounce(async () => {
      await this.debouncedSearch();
    });
  }
}
