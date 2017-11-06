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
  private static trackListTemplate = Handlebars.compile(
    document.getElementById('track-list-template').innerHTML);

  private searchDebouncer = new Debouncer(300);

  private searchInput: HTMLInputElement;
  private searchResults: HTMLElement;

  // TODO: use SearchManager once it's implemented, instead of SpotifyApi
  private searchManager: SearchManager;

  public constructor() {
    super('search', 'Recherche');
    this.searchInput =
      document.getElementById('search-input') as HTMLInputElement;
    this.searchInput.value = '';
    this.searchInput.addEventListener('input', () => {
      this.onSearchInput();
    });

    this.searchResults = document.getElementById('search-results');

    const fetcher = new FetchApiFetcher();
    const spotifyTokenManager = new SpotifyTokenManager();
    this.searchManager = new SearchManager(fetcher, spotifyTokenManager);

    this.searchResults.innerHTML = this.renderTrackList([]);
  }

  private renderTrackList(tracks: Track[]) {
    return SearchComponent.trackListTemplate({
      tracks
    });
  }

  private async debouncedSearch() {
    const val = this.searchInput.value;
    if (!val || !/\S/.test(val)) {
      // Search field empty. Nothing to do.
    } else {
      const tracks = await this.searchManager.search(val);
      this.searchResults.innerHTML = this.renderTrackList(tracks);
    }
  }

  private onSearchInput() {
    this.searchDebouncer.debounce(() => {
      this.debouncedSearch();
    });
  }
}
