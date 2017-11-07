import { Playlist } from '../data/playlist';
import { BaseComponent } from './component';
import { PlaylistManager } from '../managers/playlist-manager';

/**
 * Manages the UI of the list of playlists.
 */
export class PlaylistListComponent extends BaseComponent {
  /**
   * Template for the list of playlists.
   */
  private static playlistListTemplate = Handlebars.compile(
    document.getElementById('playlist-list-template').innerHTML);

  /**
   * UI for the list of playlists.
   */
  private playlistsUl: HTMLElement;

  /**
   * UI for the button that adds a playlist.
   */
  private addButton: HTMLElement;

  /**
   * UI for the input for the name of the playlist.
   */
  private nameInput: HTMLInputElement;

  /**
   * UI for the input group containing the button and the input for the creation of a new playlist.
   */
  private inputGroup: HTMLElement;

  /**
   * UI for the error message.
   */
  private errorMessage: HTMLElement;

  /**
   * List of playlists.
   */
  private playlists: Playlist[];

  public constructor() {
    super('playlist-list', 'Listes de reproduction');
    this.playlistsUl = document.getElementById('playlists-ul');
    this.nameInput = document.getElementById('playlist-name-input') as HTMLInputElement;
    this.addButton = document.getElementById('create-playlist-btn');
    this.inputGroup = document.getElementById('name-input-group');
    this.errorMessage = document.getElementById('add-playlist-error');
    this.addButton.addEventListener('click', () => {
      this.addPlaylist();
    });
  }

  /**
   * Show the component.
   */
  public show(): void {
    super.show();
    this.playlists = PlaylistManager.loadPlaylists();
    this.renderPlaylistList();
  }

  /**
   * Render the list of playlists.
   */
  private renderPlaylistList(): void {
    this.playlistsUl.innerHTML = PlaylistListComponent.playlistListTemplate({ playlists: this.playlists });
    const listItems = document.querySelectorAll('#playlist-list .list-group-item');
    for (let i = 0; i < listItems.length; ++i) {
      const item = listItems.item(i) as HTMLElement;
      item.addEventListener('click', () => {
        this.openPlaylist(this.playlists[+item.dataset.index]);
      });
    }
  }

  /**
   * Called when the user wants to add a new playlist.
   */
  private addPlaylist(): void {
    try {
      this.nameInput.classList.remove('is-invalid');
      this.inputGroup.classList.remove('is-invalid');
      const addedPlaylist = PlaylistManager.newPlaylist(this.nameInput.value);
      this.playlists.push(addedPlaylist);
      this.nameInput.value = '';
      this.renderPlaylistList();
    } catch (err) {
      this.nameInput.classList.add('is-invalid');
      this.inputGroup.classList.add('is-invalid');
      this.errorMessage.innerText = (err as Error).message;
    }
  }

  /**
   * Called when the user wants to open a playlist.
   * @param playlist Playlist to open.
   */
  private openPlaylist(playlist: Playlist): void {
    this.router.navigateTo('playlist', playlist);
  }
}
