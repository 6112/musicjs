import { Playlist } from '../data/playlist';
import { Track } from '../data/track';
import { PlaylistManager } from './playlist-manager';

QUnit.module('PlaylistManager', {
  afterEach: (): void => {
    const playlists = this.playlistManager.loadPlaylists();
    playlists.forEach((playlist: Playlist) => {
      this.playlistManager.deletePlaylist(playlist);
    });
  },
  beforeEach: (): void => {
    this.playlistManager = new PlaylistManager();
  }
});

QUnit.test('should create playlists correctly', (assert) => {
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

QUnit.test('should add tracks to playlists correctly', (assert) => {
  const newTrack = new Track('Look what you made me do', 'Taylor Swift', 255,
                             'https://www.youtube.com/watch?v=3tmd-ClpJxA', 'spotify');
  const taytay = this.playlistManager.newPlaylist('taytay');
  const playlist = new Playlist('taytay', []);
  playlist.tracks.push(newTrack);
  this.playlistManager.addToPlaylist(newTrack, taytay);
  assert.deepEqual(this.playlistManager.loadPlaylists(), [playlist]);
  playlist.tracks.push(newTrack);
  this.playlistManager.addToPlaylist(newTrack, taytay);
  assert.deepEqual(this.playlistManager.loadPlaylists(), [playlist]);
  this.playlistManager.deletePlaylist(taytay);
  assert.throws(() => {
    this.playlistManager.addToPlaylist(newTrack, taytay);
  });
});

QUnit.test('should remove tracks from playlists correctly', (assert) => {
  const newTrack1 = new Track('Look what you made me do', 'Taylor Swift', 255,
                              'https://www.youtube.com/watch?v=3tmd-ClpJxA', 'spotify');
  const newTrack2 = new Track('Blank space', 'Taylor Swift', 272,
                              'https://www.youtube.com/watch?v=e-ORhEE9VVg', 'spotify');
  const taytay = this.playlistManager.newPlaylist('taytay');
  this.playlistManager.addToPlaylist(newTrack1, taytay);
  this.playlistManager.addToPlaylist(newTrack2, taytay);
  this.playlistManager.addToPlaylist(newTrack1, taytay);
  const playlist = new Playlist('taytay', [newTrack1, newTrack2, newTrack1]);
  assert.deepEqual(this.playlistManager.loadPlaylists(), [playlist]);
  playlist.tracks.splice(1, 1);
  this.playlistManager.removeTrack(taytay, 1);
  assert.deepEqual(this.playlistManager.loadPlaylists(), [playlist]);
  playlist.tracks.splice(1, 1);
  this.playlistManager.removeTrack(taytay, 1);
  assert.deepEqual(this.playlistManager.loadPlaylists(), [playlist]);
  assert.throws(() => {
    this.playlistManager.removeTrack(taytay, 1);
  });
  assert.deepEqual(this.playlistManager.loadPlaylists(), [playlist]);
  this.playlistManager.deletePlaylist(taytay);
  assert.throws(() => {
    this.playlistManager.removeTrack(taytay, 0);
  });
});

QUnit.test('should move tracks in playlists correctly', (assert) => {
  const newTrack1 = new Track('Look what you made me do', 'Taylor Swift', 255,
                              'https://www.youtube.com/watch?v=3tmd-ClpJxA', 'spotify');
  const newTrack2 = new Track('Blank space', 'Taylor Swift', 272,
                              'https://www.youtube.com/watch?v=e-ORhEE9VVg', 'spotify');
  const taytay = this.playlistManager.newPlaylist('taytay');
  this.playlistManager.addToPlaylist(newTrack1, taytay);
  this.playlistManager.addToPlaylist(newTrack2, taytay);
  this.playlistManager.addToPlaylist(newTrack1, taytay);
  const playlist = new Playlist('taytay', [newTrack1, newTrack2, newTrack1]);
  assert.deepEqual(this.playlistManager.loadPlaylists(), [playlist]);
  playlist.tracks = [newTrack1, newTrack1, newTrack2];
  this.playlistManager.moveTrack(taytay, 1, 2);
  assert.deepEqual(this.playlistManager.loadPlaylists(), [playlist]);
  playlist.tracks = [newTrack2, newTrack1, newTrack1];
  this.playlistManager.moveTrack(taytay, 2, 0);
  assert.deepEqual(this.playlistManager.loadPlaylists(), [playlist]);
  assert.throws(() => {
    this.playlistManager.moveTrack(taytay, 3, 0);
  });
  assert.deepEqual(this.playlistManager.loadPlaylists(), [playlist]);
  this.playlistManager.deletePlaylist(taytay);
  assert.throws(() => {
    this.playlistManager.moveTrack(taytay, 0, 2);
  });
  assert.deepEqual(this.playlistManager.loadPlaylists(), []);
});
