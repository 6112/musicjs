import { Audio, PlayerManager } from './player-manager';
import { Provider } from '../data/provider';
import { Track } from '../data/track';
import { Playlist } from '../data/playlist';
import { Emitter } from '../components/emitter';

/**
 * A mock of the HTMLAudioElement.
 */
class MockAudio extends Emitter implements Audio  {
  /**
   * Number of milliseconds representing the length of the track.
   */
  public static DELAY = 3000;

  /**
   * Represents the src of the track.
   */
  public src: string;

  /**
   * The timeout used to indicate the end of the played track.
   */
  private timeout: NodeJS.Timer;

  /**
   * Indicates if the player is paused.
   */
  public paused = true;

  /**
   * Play the track.
   */
  public async play(): Promise<void> {
    this.timeout = setTimeout(
      () => {
        this.dispatchEvent(new CustomEvent('ended'));
      },
      MockAudio.DELAY
    );
    this.paused = false;
  }

  /**
   * Pause the track.
   */
  public pause(): void {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    this.paused = true;
  }

  /**
   * Add an event listener to this object.
   * @param type Type of the event listener.
   * @param listener Callback.
   * @param useCapture not used
   */
  public addEventListener(type: string, listener: EventListenerOrEventListenerObject, useCapture?: boolean): void {
    super.addEventListener(type, listener);
  }
}

QUnit.module('PlayerManager');

QUnit.test('should play a track', (assert) => {
  const done = assert.async();
  const src = 'https://e-cdns-preview-4.dzcdn.net/stream/4957d8283d8face656a373f3b18087fa-1.mp3';
  const trackLength = 326;
  const track = new Track('Lose Yourself (Soundtrack Version)', 'Eminem', 'a', trackLength, src, Provider.DEEZER);
  const audio = new MockAudio();
  const playLength = MockAudio.DELAY;
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
  const track1 = new Track('Lose Yourself (Soundtrack Version)', 'Eminem', 'a', trackLength1, src1, Provider.DEEZER);
  const src2 = 'https://e-cdns-preview-1.dzcdn.net/stream/12746e76901990be6a65d3e0da939510-2.mp3';
  const trackLength2 = 211;
  const track2 = new Track('Look What You Made Me Do', 'Taylor Swift', 'a', trackLength2, src2, Provider.DEEZER);
  const playlist = new Playlist('Eminem', [track1, track2]);
  const audio = new MockAudio();
  const playLength = MockAudio.DELAY;
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
