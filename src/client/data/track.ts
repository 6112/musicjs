/**
 * Object representing a Track from any source.
 */
export class Track {
  public static deserialize(json: string): Track {
    throw new Error('Unimplemented');
  }

  constructor(public title: string,
              public artist: string,
              public length: number, // seconds
              public uri: string) { }

  public serialize(): string {
    throw new Error('Unimplemented');
  }
}
