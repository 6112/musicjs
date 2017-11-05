import { Playlist } from './playlist';
import { Provider } from './provider';
import { Track } from './track';

QUnit.module('Playlist');
QUnit.test('Playlist should serialize and deserialize properly', (assert) => {
  const trackLength = 255;
  const tracks = [
    new Track('Look what you made me do', 'Taylor Swift', trackLength,
              'https://www.youtube.com/watch?v=3tmd-ClpJxA', Provider.SPOTIFY)
  ];
  const name = 'taytay';
  const playlist = new Playlist(name, tracks);
  const serialized = playlist.serialize();
  const deserialized = Playlist.deserialize(serialized);
  assert.deepEqual(deserialized, playlist);
});
