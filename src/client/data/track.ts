import { Provider } from './provider';

/**
 * Object representing a Track from any source.
 */
export class Track {
  public static deserialize(json: string): Track {
    const parsed = JSON.parse(json) as {
      title: string;
      artist: string;
      length: number;
      uri: string;
      provider: Provider;
    };
    return new Track(parsed.title, parsed.artist, parsed.length, parsed.uri, parsed.provider);
  }

  public constructor(public title: string,
                     public artist: string,
                     public length: number, // Seconds
                     public uri: string,
                     public provider: Provider) { }

  public serialize(): string {
    return JSON.stringify({
      artist: this.artist,
      length: this.length,
      provider: this.provider,
      title: this.title,
      uri: this.uri
    });
  }
}
