import { Playlist } from '../data/playlist';
import { BaseComponent } from './component';
import { PlaylistManager } from '../managers/playlist-manager';

export class PlaylistListComponent extends BaseComponent {
  private static playlistListTemplate = Handlebars.compile(
    document.getElementById('playlist-list-template').innerHTML);

  private playlistsUl: HTMLElement;
  private addButton: HTMLElement;
  private nameInput: HTMLInputElement;
  private inputGroup: HTMLElement;
  private playlists: Playlist[];
  private errorMessage: HTMLElement;

  public constructor() {
    super('playlist-list', 'Playlists');
    this.playlists = PlaylistManager.loadPlaylists();
    this.playlistsUl = document.getElementById('playlists-ul');
    this.nameInput = document.getElementById('playlist-name-input') as HTMLInputElement;
    this.addButton = document.getElementById('create-playlist-btn');
    this.inputGroup = document.getElementById('name-input-group');
    this.errorMessage = document.getElementById('add-playlist-error');
    this.renderPlaylistList();
    this.addButton.addEventListener('click', this.onAdd.bind(this));
  }

  private renderPlaylistList(): void {
    this.playlistsUl.innerHTML = PlaylistListComponent.playlistListTemplate({ playlists: this.playlists });
    const listItems = document.getElementsByClassName('list-group-item');
    for (let i = 0; i < listItems.length; ++i) {
      const item = listItems.item(i) as HTMLElement;
      item.addEventListener('click', this.onPlaylistClick.bind(this, this.playlists[+item.dataset.index]));
    }
  }

  private onAdd(): void {
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

  private onPlaylistClick(playlist: Playlist): void {
    // todo : use router ? to open the playlistComponent
    console.log(playlist.name);
  }
}
