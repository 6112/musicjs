/**
 * Object representing a Track from any source.
 */
export class Track {
  constructor(public title: string,
              public artist: string,
              public length: number, // seconds
              public uri: string) {
  }

  render() {
    const li = document.createElement("li")
    const a = document.createElement("a")
    a.setAttribute("href", "")
    a.innerText = this.title
    li.appendChild(a)
    return li
  }

  serialize(): string {
    throw new Error("Unimplemented")
  }

  static deserialize(json: string): Track {
    throw new Error("Unimplemented")
  }
}
