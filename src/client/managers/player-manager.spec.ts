import { PlayerManager } from './player-manager';
import { Provider } from '../data/provider';
import { Track } from '../data/track';
import { Playlist } from '../data/playlist';

QUnit.module('PlayerManager');

QUnit.test('should play a track', (assert) => {
  const done = assert.async();
  const src = 'https://e-cdns-preview-4.dzcdn.net/stream/4957d8283d8face656a373f3b18087fa-1.mp3';
  const trackLength = 326;
  const track = new Track('Lose Yourself (Soundtrack Version)', 'Eminem', trackLength, src, Provider.DEEZER);
  const audio = new Audio();
  const playLength = 30000;
  const bufferTime = 10000;
  const startTime = new Date().getTime();
  audio.addEventListener('ended', () => {
    const endTime = new Date().getTime();
    assert.ok(endTime - startTime >= playLength);
    assert.ok(endTime - startTime <= playLength + bufferTime);
    assert.deepEqual(src, audio.src);
    done();
  });
  PlayerManager.playTrack(track, audio);
});

QUnit.test('should play a playlist', (assert) => {
  const numberOfExpectedDones = 2;
  const done = assert.async(numberOfExpectedDones);
  const src1 = 'https://e-cdns-preview-4.dzcdn.net/stream/4957d8283d8face656a373f3b18087fa-1.mp3';
  const trackLength1 = 326;
  const track1 = new Track('Lose Yourself (Soundtrack Version)', 'Eminem', trackLength1, src1, Provider.DEEZER);
  const src2 = 'https://e-cdns-preview-1.dzcdn.net/stream/12746e76901990be6a65d3e0da939510-2.mp3';
  const trackLength2 = 211;
  const track2 = new Track('Look What You Made Me Do', 'Taylor Swift', trackLength2, src2, Provider.DEEZER);
  const playlist = new Playlist('Eminem', [track1, track2]);
  const audio = new Audio();
  const playLength = 30000;
  const bufferTime = 10000;
  let currentSrc = src1;
  let startTime = new Date().getTime();
  audio.addEventListener('ended', () => {
    const endTime = new Date().getTime();
    assert.ok(endTime - startTime >= playLength);
    assert.ok(endTime - startTime <= playLength + bufferTime);
    assert.deepEqual(currentSrc, audio.src);
    currentSrc = src2;
    startTime = new Date().getTime();
    done();
  });
  PlayerManager.playPlaylist(playlist, audio);
});
