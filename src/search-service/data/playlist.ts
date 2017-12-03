import { Track } from './track';

/**
 * Represents a playlist, which is a named list of tracks.
 */
export class Playlist {
  /**
   * Transform a playlist from its JSON representation to its object representation.
   * @param json JSON representation of the playlist.
   * @return Object representation of the playlist.
   */
  public static deserialize(json: string): Playlist {
    const parsed = JSON.parse(json) as { name: string; tracks: string[] };
    const tracks = parsed.tracks.map((track) => Track.deserialize(track));
    return new Playlist(parsed.name, tracks);
  }

  /**
   * Create a playlist object.
   * @param name Name of the playlist.
   * @param tracks List of tracks of the playlist.
   */
  public constructor(public name: string, public tracks: Track[]) {}

  /**
   * Transform the playlist from its object representation to its JSON representation.
   * @return JSON representation of the playlist.
   */
  public serialize(): string {
    return JSON.stringify({
      name: this.name,
      tracks: this.tracks.map((track: Track) => track.serialize())
    });
  }
}
