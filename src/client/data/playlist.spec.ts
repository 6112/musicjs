import { Playlist } from './playlist';
import { Track } from './track';

QUnit.test('Playlist should serialize and deserialize properly', (assert) => {
  const tracks = [
    new Track('Look what you made me do', 'Taylor Swift',
              255, 'https://www.youtube.com/watch?v=3tmd-ClpJxA')
  ];
  const name = 'taytay';
  const playlist = new Playlist(name, tracks);
  const serialized = playlist.serialize();
  const deserialized = Playlist.deserialize(serialized);
  assert.equal(playlist.name, deserialized.name);
  assert.equal(playlist.tracks, deserialized.tracks);
});