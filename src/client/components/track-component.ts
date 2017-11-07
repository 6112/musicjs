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
   * Track which details are shown.
   */
  private track: Track;

  /**
   * Constructor.
   * @param audio Audio object to use.
   */
  public constructor(private audio: HTMLAudioElement) {
    super('track', 'Chanson');
  }

  /**
   * Display the component.
   * @param payload Track which details are shown.
   */
  public show(payload: Track) {
    super.show(payload);
    this.track = payload;
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
    PlayerManager.playTrack(this.track, this.audio);
  }
}
