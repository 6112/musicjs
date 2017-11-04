/**
 * Object representing a Track from any source.
 */
export class Track {
  public static deserialize(json: string): Track {
    const parsed = JSON.parse(json);
    return new Track(parsed.title, parsed.artist, parsed.length, parsed.uri,
                     parsed.provider);
  }

  constructor(public title: string,
              public artist: string,
              public length: number, // seconds
              public uri: string,
              public provider: 'deezer' | 'spotify' | 'soundcloud') { }

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
