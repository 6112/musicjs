import { Playlist } from '../data/playlist';
import { Track } from '../data/track';
import { Provider } from '../data/provider';
import { PlaylistManager } from './playlist-manager';

const trackLength1 = 255;
const trackLength2 = 272;

QUnit.module('PlaylistManager', {
  afterEach: (): void => {
    const playlists = PlaylistManager.loadPlaylists();
    playlists.forEach((playlist: Playlist) => {
      PlaylistManager.deletePlaylist(playlist);
    });
  }
});

QUnit.test('should create playlists correctly', (assert) => {
  const playlists = [new Playlist('taytay', [])];
  PlaylistManager.newPlaylist('taytay');
  assert.deepEqual(PlaylistManager.loadPlaylists(), playlists);
  playlists.push(new Playlist('kanye', []));
  PlaylistManager.newPlaylist('kanye');
  assert.deepEqual(PlaylistManager.loadPlaylists(), playlists);
  assert.throws(() => {
    PlaylistManager.newPlaylist('taytay');
  });
  assert.deepEqual(PlaylistManager.loadPlaylists(), playlists);
});

QUnit.test('should delete playlists correctly', (assert) => {
  const taytay = PlaylistManager.newPlaylist('taytay');
  const kanye = PlaylistManager.newPlaylist('kanye');
  const beibs = PlaylistManager.newPlaylist('beibs');
  assert.deepEqual(PlaylistManager.loadPlaylists(), [taytay, kanye, beibs]);
  PlaylistManager.deletePlaylist(kanye);
  assert.deepEqual(PlaylistManager.loadPlaylists(), [taytay, beibs]);
  assert.throws(() => {
    PlaylistManager.deletePlaylist(kanye);
  });
  assert.deepEqual(PlaylistManager.loadPlaylists(), [taytay, beibs]);
  PlaylistManager.deletePlaylist(taytay);
  assert.deepEqual(PlaylistManager.loadPlaylists(), [beibs]);
});

QUnit.test('should add tracks to playlists correctly', (assert) => {
  const newTrack = new Track('Look what you made me do', 'Taylor Swift', trackLength1,
                             'https://www.youtube.com/watch?v=3tmd-ClpJxA', Provider.SPOTIFY);
  const taytay = PlaylistManager.newPlaylist('taytay');
  const playlist = new Playlist('taytay', []);
  playlist.tracks.push(newTrack);
  PlaylistManager.addToPlaylist(newTrack, taytay);
  assert.deepEqual(PlaylistManager.loadPlaylists(), [playlist]);
  playlist.tracks.push(newTrack);
  PlaylistManager.addToPlaylist(newTrack, taytay);
  assert.deepEqual(PlaylistManager.loadPlaylists(), [playlist]);
  PlaylistManager.deletePlaylist(taytay);
  assert.throws(() => {
    PlaylistManager.addToPlaylist(newTrack, taytay);
  });
});

QUnit.test('should remove tracks from playlists correctly', (assert) => {
  const newTrack1 = new Track('Look what you made me do', 'Taylor Swift', trackLength1,
                              'https://www.youtube.com/watch?v=3tmd-ClpJxA', Provider.SPOTIFY);
  const newTrack2 = new Track('Blank space', 'Taylor Swift', trackLength2,
                              'https://www.youtube.com/watch?v=e-ORhEE9VVg', Provider.SPOTIFY);
  const taytay = PlaylistManager.newPlaylist('taytay');
  PlaylistManager.addToPlaylist(newTrack1, taytay);
  PlaylistManager.addToPlaylist(newTrack2, taytay);
  PlaylistManager.addToPlaylist(newTrack1, taytay);
  const playlist = new Playlist('taytay', [newTrack1, newTrack2, newTrack1]);
  assert.deepEqual(PlaylistManager.loadPlaylists(), [playlist]);
  playlist.tracks.splice(1, 1);
  PlaylistManager.removeTrack(taytay, 1);
  assert.deepEqual(PlaylistManager.loadPlaylists(), [playlist]);
  playlist.tracks.splice(1, 1);
  PlaylistManager.removeTrack(taytay, 1);
  assert.deepEqual(PlaylistManager.loadPlaylists(), [playlist]);
  assert.throws(() => {
    PlaylistManager.removeTrack(taytay, 1);
  });
  assert.deepEqual(PlaylistManager.loadPlaylists(), [playlist]);
  PlaylistManager.deletePlaylist(taytay);
  assert.throws(() => {
    PlaylistManager.removeTrack(taytay, 0);
  });
});

QUnit.test('should move tracks in playlists correctly', (assert) => {
  const first = 0;
  const second = 1;
  const third = 2;
  const fourth = 3;
  const newTrack1 = new Track('Look what you made me do', 'Taylor Swift', trackLength1,
                              'https://www.youtube.com/watch?v=3tmd-ClpJxA', Provider.SPOTIFY);
  const newTrack2 = new Track('Blank space', 'Taylor Swift', trackLength2,
                              'https://www.youtube.com/watch?v=e-ORhEE9VVg', Provider.SPOTIFY);
  const taytay = PlaylistManager.newPlaylist('taytay');
  PlaylistManager.addToPlaylist(newTrack1, taytay);
  PlaylistManager.addToPlaylist(newTrack2, taytay);
  PlaylistManager.addToPlaylist(newTrack1, taytay);
  const playlist = new Playlist('taytay', [newTrack1, newTrack2, newTrack1]);
  assert.deepEqual(PlaylistManager.loadPlaylists(), [playlist]);
  playlist.tracks = [newTrack1, newTrack1, newTrack2];
  PlaylistManager.moveTrack(taytay, second, third);
  assert.deepEqual(PlaylistManager.loadPlaylists(), [playlist]);
  playlist.tracks = [newTrack2, newTrack1, newTrack1];
  PlaylistManager.moveTrack(taytay, third, first);
  assert.deepEqual(PlaylistManager.loadPlaylists(), [playlist]);
  assert.throws(() => {
    PlaylistManager.moveTrack(taytay, fourth, first);
  });
  assert.deepEqual(PlaylistManager.loadPlaylists(), [playlist]);
  PlaylistManager.deletePlaylist(taytay);
  assert.throws(() => {
    PlaylistManager.moveTrack(taytay, first, third);
  });
  assert.deepEqual(PlaylistManager.loadPlaylists(), []);
});
