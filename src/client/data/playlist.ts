import { Track } from './track';

export class Playlist {
  public static deserialize(json: string): Playlist {
    const parsed = JSON.parse(json) as { name: string; tracks: string[] };
    const tracks = parsed.tracks.map((track) => Track.deserialize(track));
    return new Playlist(parsed.name, tracks);
  }

  public constructor(public name: string, public tracks: Track[]) {}

  public serialize(): string {
    return JSON.stringify({
      name: this.name,
      tracks: this.tracks.map((track: Track) => track.serialize())
    });
  }
}
