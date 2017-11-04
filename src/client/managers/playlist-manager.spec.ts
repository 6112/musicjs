import { Playlist } from '../data/playlist';
import { PlaylistManager } from './playlist-manager';

QUnit.module('PlaylistManager', {
  beforeEach: (): void => {
    this.playlistManager = new PlaylistManager();
    const playlists = this.playlistManager.loadPlaylists();
    playlists.forEach((playlist: Playlist) => {
      this.playlistManager.deletePlaylist(playlist);
    });
    this.playlistManager = new PlaylistManager();
  }
});

QUnit.test('should create a new Playlist correctly', (assert) => {
  const playlists = [new Playlist('taytay', [])];
  this.playlistManager.newPlaylist('taytay');
  assert.deepEqual(this.playlistManager.loadPlaylists(), playlists);
  playlists.push(new Playlist('kanye', []));
  this.playlistManager.newPlaylist('kanye');
  assert.deepEqual(this.playlistManager.loadPlaylists(), playlists);
  assert.throws(() => {
    this.playlistManager.newPlaylist('taytay');
  });
  assert.deepEqual(this.playlistManager.loadPlaylists(), playlists);
});

QUnit.test('should delete playlists correctly', (assert) => {
  const taytay = this.playlistManager.newPlaylist('taytay');
  const kanye = this.playlistManager.newPlaylist('kanye');
  const beibs = this.playlistManager.newPlaylist('beibs');
  assert.deepEqual(this.playlistManager.loadPlaylists(), [taytay, kanye, beibs]);
  this.playlistManager.deletePlaylist(kanye);
  assert.deepEqual(this.playlistManager.loadPlaylists(), [taytay, beibs]);
  assert.throws(() => {
    this.playlistManager.deletePlaylist(kanye);
  });
  assert.deepEqual(this.playlistManager.loadPlaylists(), [taytay, beibs]);
  this.playlistManager.deletePlaylist(taytay);
  assert.deepEqual(this.playlistManager.loadPlaylists(), [beibs]);
});
