/**
 * Object representing a Track from any source.
 */
export class Track {
  constructor(public title: string,
              public artist: string,
              public length: number, // seconds
              public uri: string) {
  }

  serialize(): string {
    throw new Error("Unimplemented")
  }

  static deserialize(json: string): Track {
    throw new Error("Unimplemented")
  }
}
