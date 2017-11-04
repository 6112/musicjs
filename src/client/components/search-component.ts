import { Track } from '../data/track';
import { FetchApiFetcher } from '../managers/api/fetch';
import { SpotifyApi, SpotifyTokenManager } from '../managers/api/spotify-api';
import { Debouncer } from './debouncer';

/**
 * UI Component for searching tracks and displaying the list of results.
 */
export class SearchComponent {
  private static trackListTemplate = Handlebars.compile(
    document.getElementById('track-list-template').innerHTML);

  private searchDebouncer = new Debouncer(300);

  private searchInput: HTMLInputElement;
  private searchResults: HTMLElement;

  // TODO: use SearchManager once it's implemented, instead of SpotifyApi
  private spotify: SpotifyApi;

  constructor() {
    this.searchInput =
      document.getElementById('search-input') as HTMLInputElement;
    this.searchInput.value = '';
    this.searchInput.addEventListener('input', this.onSearchInput.bind(this));

    this.searchResults = document.getElementById('search-results');

    const fetcher = new FetchApiFetcher();
    const spotifyTokenManager = new SpotifyTokenManager();
    this.spotify = new SpotifyApi(fetcher, spotifyTokenManager);
  }

  private renderTrackList(tracks: Track[]) {
    return SearchComponent.trackListTemplate({
      tracks,
    });
  }

  private async debouncedSpotifySearch() {
    const val = this.searchInput.value;
    if (!val || !/\S/.test(val)) {
      // Search field empty. Nothing to do.
    } else {
      const tracks = await this.spotify.search(val);
      console.log(tracks);
      this.searchResults.innerHTML = this.renderTrackList(tracks);
    }
  }

  private onSearchInput() {
    this.searchDebouncer.debounce(this.debouncedSpotifySearch.bind(this));
  }
}
