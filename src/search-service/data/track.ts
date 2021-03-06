import { Provider } from './provider';

/**
 * Object representing a Track from any source.
 */
export class Track {
  /**
   * Transform a track from its JSON representation to its object representation.
   * @param json JSON representation of the track.
   * @return Object representation of the track.
   */
  public static deserialize(json: string): Track {
    const parsed = JSON.parse(json) as {
      title: string;
      artist: string;
      album: string;
      length: number;
      uri: string;
      provider: Provider;
    };
    return new Track(parsed.title, parsed.artist, parsed.album,
                     parsed.length, parsed.uri, parsed.provider);
  }

  /**
   * Create a new track.
   * @param title Title of the track.
   * @param artist Artist of the track.
   * @param album Name of the album of the track.
   * @param length Length of the track in seconds.
   * @param uri URI to the audio file for the track.
   * @param provider Provider of the track.
   */
  public constructor(public title: string,
                     public artist: string,
                     public album: string,
                     public length: number,
                     public uri: string,
                     public provider: Provider) { }

  /**
   * Transform the track from its object representation to its JSON representation.
   * @return JSON representation of the track.
   */
  public serialize(): string {
    return JSON.stringify({
      artist: this.artist,
      album: this.album,
      length: this.length,
      provider: this.provider,
      title: this.title,
      uri: this.uri
    });
  }
}
