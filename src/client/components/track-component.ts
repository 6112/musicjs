import { BaseComponent } from './component';
import { Playlist } from '../data/playlist';
import { Track } from '../data/track';
import { PlaylistManager } from '../managers/playlist-manager';

/**
 * Manages the UI of the details of a track.
 */
export class TrackComponent extends BaseComponent {
  /**
   * Template for the HTML to display.
   */
  private static trackTemplate = Handlebars.template(
    document.getElementById('track-template').innerHTML);

  /**
   * Track which details are shown.
   */
  private track: Track;

  private wrapper: HTMLElement;

  public constructor() {
    super('track', 'Chanson');
    this.wrapper = document.getElementById('track');
  }

  /**
   * Display the component.
   * @param payload Track which details are shown.
   */
  public show(payload: Track) {
    this.track = payload;
    this.wrapper.innerHTML =
      SearchComponent.trackTemplate(track);
  }

  /**
   * Add the track to the given playlist.
   * @param playlist Playlist to add the track to.
   */
  public addToPlaylist(playlist: Playlist): void {
    PlaylistManager.addToPlaylist(this.track, playlist);
  }

  /**
   * Loads the list of playlists
   */
  public loadPlaylists(): void {
    PlaylistManager.loadPlaylists();
  }

  /**
   * Navigate to the PlayerComponent.
   */
  public playTrack(): void {
    // TODO : navigate to the PlayerComponent with the track.
  }
}
