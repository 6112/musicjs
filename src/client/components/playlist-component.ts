import { BaseComponent } from './component';
import { Playlist } from '../data/playlist';
import { PlaylistManager } from '../managers/playlist-manager';

/**
 * Manages the UI of the details of a playlist.
 */
export class PlaylistComponent extends BaseComponent {
  /**
   * Template for the list of tracks.
   */
  private static trackListTemplate = Handlebars.compile(
    document.getElementById('playlist-tracks-list-template').innerHTML);

  /**
   * Template for the playlist's info.
   */
  private static playlistInfoTemplate = Handlebars.compile(
    document.getElementById('playlist-info-template').innerHTML);

  /**
   * UI for the list of tracks.
   */
  private tracks: HTMLElement;

  /**
   * Playlist which details are shown.
   */
  private playlist: Playlist;

  /**
   * UI for the delete button.
   */
  private deleteButton: HTMLElement;

  /**
   * UI for the playlist's info.
   */
  private playlistInfo: HTMLElement;

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

    this.playlistInfo = document.getElementById('playlist-info');
    this.playlistInfo.innerHTML = this.renderPlaylistInfo();

    this.tracks = document.getElementById('tracks-ul');
    this.tracks.innerHTML = this.renderTracks();
    this.tracks.querySelectorAll('.list-group-item').forEach((track: Element) => {
      track.addEventListener('click', () => {
        this.openTrack(+(track as HTMLElement).dataset.index);
      });
    });

    this.deleteButton = document.getElementById('delete-playlist');
    this.deleteButton.addEventListener('click', () => {
      this.deletePlaylist();
    });
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
    this.router.navigateTo('track', this.playlist.tracks[pos]);
  }

  /**
   * Render the list of tracks.
   * @return UI for the list of tracks.
   */
  private renderTracks(): string {
    return PlaylistComponent.trackListTemplate({ playlist: this.playlist });
  }

  /**
   * Render the playlist's info.
   * @return UI for the playlist's info.
   */
  private renderPlaylistInfo(): string {
    return PlaylistComponent.playlistInfoTemplate({ playlist: this.playlist });
  }
}
