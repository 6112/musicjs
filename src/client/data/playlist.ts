import { Track } from './track';

export class Playlist {
  constructor(public name: string, 
              public tracks: Array<Track>) {}
}
