import { BaseComponent } from './component';
import { Playlist } from '../data/playlist';
import { PlaylistManager } from '../managers/playlist-manager';

/**
 * Manages the UI of the details of a playlist.
 */
export class PlaylistComponent extends BaseComponent {
  /**
   * Playlist which details are shown.
   */
  private playlist: Playlist;

  public constructor() {
    super('playlist', 'Liste de reproduction');
  }

  /**
   * Display the component.
   * @param payload Playlist which details are shown.
   */
  public show(payload: Playlist) {
    super.show(payload);
    this.playlist = payload;
  }

  /**
   * Delete the playlist.
   */
  public deletePlaylist(): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette liste de reproduction ?')) {
      PlaylistManager.deletePlaylist(this.playlist);
      this.router.navigateTo('playlist-list');
    }
  }

  /**
   * Remove a track from the playlist
   * @param pos Position of the track in the playlist.
   */
  public removeTrack(pos: number): void {
    if (confirm('Ëtes-vous sûr de vouloir enlever cette chanson ?')) {
      PlaylistManager.removeTrack(this.playlist, pos);
      // TODO : re-render the list of tracks
    }
  }

  /**
   * Change the position of a track inside the playlist.
   * @param oldPos Old position of the track.
   * @param newPos New position of the track.
   */
  public moveTrack(oldPos: number, newPos: number): void {
    PlaylistManager.moveTrack(this.playlist, oldPos, newPos);
    // TODO : re-render the list of tracks ?
  }

  /**
   * Navigate to the PlayerComponent.
   */
  public playPlaylist(): void {
    // TODO : navigate to the player component
  }

  /**
   * Navigate to the TrackComponent of the given track.
   * @param pos Position of the track to open.
   */
  public openTrack(pos: number): void {
    // TODO : navigate to the track component
  }
}
