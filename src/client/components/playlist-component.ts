import { BaseComponent } from './component';
import { Playlist } from '../data/playlist';
import { PlaylistManager } from '../managers/playlist-manager';
import { PlayerManager } from '../managers/player-manager';

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
   * Playlist which details are shown.
   */
  private playlist: Playlist;

  /**
   * Constructor.
   * @param audio Audio object to use.
   */
  public constructor(private audio: HTMLAudioElement) {
    super('playlist', 'Liste de reproduction');
  }

  /**
   * Display the component.
   * @param payload Playlist which details are shown.
   */
  public show(payload: Playlist) {
    super.show(payload);
    this.playlist = payload;
    this.renderPlaylistInfo();
    this.renderTracks();
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
      this.playlist = PlaylistManager.removeTrack(this.playlist, pos);
      this.renderTracks();
      this.renderPlaylistInfo();
    }
  }

  /**
   * Change the position of a track inside the playlist.
   * @param oldPos Old position of the track.
   * @param newPos New position of the track.
   */
  public moveTrack(oldPos: number, newPos: number): void {
    this.playlist = PlaylistManager.moveTrack(this.playlist, oldPos, newPos);
    this.renderTracks();
  }

  /**
   * Navigate to the PlayerComponent.
   */
  public playPlaylist(): void {
    PlayerManager.playPlaylist(this.playlist, this.audio);
  }

  /**
   * Navigate to the TrackComponent of the given track.
   * @param pos Position of the track to open.
   */
  public openTrack(pos: number): void {
    // TODO : navigate to the track component correctly ?
    this.router.navigateTo('track', this.playlist.tracks[pos]);
  }

  /**
   * Render the list of tracks.
   * @return UI for the list of tracks.
   */
  private renderTracks(): void {
    const tracks = document.getElementById('tracks-ul');
    tracks.innerHTML = PlaylistComponent.trackListTemplate({ playlist: this.playlist });
    tracks.querySelectorAll('.list-group-item').forEach((track: Element) => {
      track.addEventListener('click', () => {
        this.openTrack(+(track as HTMLElement).dataset.index);
      });
      track.addEventListener('dragstart', (event: DragEvent) => {
        event.dataTransfer.setData('oldPos', (track as HTMLElement).dataset.index);
      });
      track.addEventListener('dragover', (event: DragEvent) => {
        event.preventDefault();
      });
      track.addEventListener('drop', (event: DragEvent) => {
        event.preventDefault();
        this.moveTrack(+event.dataTransfer.getData('oldPos'), +(track as HTMLElement).dataset.index);
      });
    });
    tracks.querySelectorAll('.delete-track').forEach((element: Element) => {
      element.addEventListener('click', (event: Event) => {
        this.removeTrack(+(element as HTMLElement).dataset.index);
        event.stopPropagation();
      });
    });
  }

  /**
   * Render the playlist's info.
   * @return UI for the playlist's info.
   */
  private renderPlaylistInfo(): void {
    const playlistInfo = document.getElementById('playlist-info');
    playlistInfo.innerHTML = PlaylistComponent.playlistInfoTemplate({
      playlist: this.playlist,
      plural: this.playlist.tracks.length > 1
    });
    playlistInfo.querySelector('#delete-playlist').addEventListener('click', () => {
      this.deletePlaylist();
    });
    playlistInfo.querySelector('#play-playlist').addEventListener('click', () => {
      this.playPlaylist();
    });
  }
}
