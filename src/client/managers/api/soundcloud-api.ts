import { Track } from "../../data/track";
import { MusicApi } from "./music-api";

export class SoundCloudApi implements MusicApi {
  public search(query: string): Promise<Track[]> {
    throw new Error("Method not implemented.");
  }
}
