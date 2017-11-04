import { Playlist } from '../data/playlist';
import { BaseComponent } from './component';

export class PlaylistListComponent extends BaseComponent {
  private static playlistListTemplate = Handlebars.compile(
    document.getElementById('playlist-list-template').innerHTML);

  private playlistsUl: HTMLElement;

  constructor() {
    super('playlist-list', 'Playlists');
    this.playlistsUl = document.getElementById('playlists-ul');
    this.playlistsUl.innerHTML = this.renderPlaylistList([]);
  }

  private renderPlaylistList(playlists: Playlist[]) {
    return PlaylistListComponent.playlistListTemplate({
      playlists
    });
  }
}
