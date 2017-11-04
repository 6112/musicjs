import { Track } from './track';

export class Playlist {
  public static deserialize(json: string): Playlist {
    const parsed = JSON.parse(json);
    const tracks = parsed.tracks.map((track: any) => Track.deserialize(track));
    return new Playlist(parsed.name, tracks);
  }

  constructor(public name: string, 
              public tracks: Array<Track>) {}

  public serialize(): string {
    return JSON.stringify({
      name: this.name,
      tracks: this.tracks.map((track: Track) => track.serialize())
    });
  }
}
