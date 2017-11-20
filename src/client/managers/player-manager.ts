import { Playlist } from '../data/playlist';
import { Track } from '../data/track';

export interface Audio {
  src: string;
  paused: boolean;
  play(): void;
  pause(): void;
  addEventListener(type: string, listener: EventListenerOrEventListenerObject, useCapture?: boolean): void;
}

/**
 * Manages the track player.
 */
export class PlayerManager {
  /**
   * Play a playlist.
   * @param playlist Playlist to play.
   * @param audio Audio object to use.
   */
  public static playPlaylist(playlist: Playlist, audio: Audio): void {
    PlayerManager.play(playlist, 0, audio);
  }

  /**
   * Play a track.
   * @param track Track to play.
   * @param audio Audio object to use.
   * @param done Optional callback called when the track is done playing.
   */
  public static playTrack(track: Track, audio: Audio, done?: () => void): void {
    if (!audio.paused) {
      audio.pause();
    }
    audio.src = track.uri;
    if (done) {
      audio.addEventListener('ended', () => {
        audio.pause();
        done();
      });
    }
    audio.play();
  }

  /**
   * Play a playlist starting from a certain position.
   * @param playlist Playlist to play.
   * @param pos Position of the playback's starting track.
   * @param audio Audio object to use.
   */
  private static play(playlist: Playlist, pos: number, audio: Audio): void {
    if (pos < playlist.tracks.length) {
      PlayerManager.playTrack(playlist.tracks[pos], audio, () => {
        PlayerManager.play(playlist, pos + 1, audio);
      });
    }
  }
}
