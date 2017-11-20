import { BaseComponent } from './component';
import { Playlist } from '../data/playlist';
import { Track } from '../data/track';
import { PlaylistManager } from '../managers/playlist-manager';
import { PlayerManager } from '../managers/player-manager';

/**
 * Manages the UI of the details of a track.
 */
export class TrackComponent extends BaseComponent {
  /**
   * Template for the HTML to display.
   */
  private static trackTemplate = Handlebars.compile(document.getElementById('track-template').innerHTML);

  /**
   * Loads the list of playlists
   */
  public static loadPlaylists(): Playlist[] {
    return PlaylistManager.loadPlaylists();
  }

  /**
   * Track which details are shown.
   */
  private track: Track;

  /**
   * Loaded playlists.
   */
  private playlists: Playlist[];

  /**
   * UI of the track.
   */
  private wrapper: HTMLElement;

  /**
   * Constructor.
   * @param audio Audio object to use.
   */
  public constructor(private audio: HTMLAudioElement) {
    super('track', 'Chanson');
    this.wrapper = document.getElementById('track');
  }

  /**
   * Display the component.
   * @param payload Track which details are shown.
   */
  public show(payload: Track) {
    super.show(payload);
    this.track = payload;
    this.playlists = TrackComponent.loadPlaylists();
    this.wrapper.innerHTML = TrackComponent.trackTemplate({ track: this.track, playlists: this.playlists});
    document.getElementById('play-track').addEventListener('click', () => {
      this.playTrack();
    });
    document.getElementById('add-to-playlist').addEventListener('click', () => {
      const select = document.getElementById('select-playlist') as HTMLSelectElement;
      if (select.value) {
        this.addToPlaylist(this.playlists[+select.value]);
      }
    });
  }

  /**
   * Add the track to the given playlist.
   * @param playlist Playlist to add the track to.
   */
  public addToPlaylist(playlist: Playlist): void {
    PlaylistManager.addToPlaylist(this.track, playlist);
  }

  /**
   * Navigate to the PlayerComponent.
   */
  public playTrack(): void {
    PlayerManager.playTrack(this.track, this.audio);
  }
}
