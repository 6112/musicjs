import { Playlist } from '../data/playlist';
import { Track } from '../data/track';

export class PlaylistManager {
  public addToPlaylist(track: Track, playlist: Playlist): void {
    const playlists = this.load();
    const found = this.findPlaylist(playlist, playlists);
    if (found) {
      found.tracks.push(track);
      this.save(playlists);
    } else {
      this.notFound(playlist);
    }
  }

  public deletePlaylist(playlist: Playlist): void {
    const playlists = this.load();
    const found = playlists.findIndex((pl) => pl.name === playlist.name);
    if (found !== -1) {
      playlists.splice(found, 1);
      this.save(playlists);
    } else {
      this.notFound(playlist);
    }
  }

  public loadPlaylists(): Playlist[] {
    return this.load();
  }

  public moveTrack(playlist: Playlist, oldPos: number, newPos: number): void {
    const playlists = this.load();
    const found = this.findPlaylist(playlist, playlists);
    if (found) {
      if (oldPos >= 0 && oldPos < found.tracks.length) {
        const track = found.tracks.splice(oldPos, 1)[0];
        found.tracks.splice(newPos, 0, track);
        this.save(playlists);
      } else {
        this.outOfBounds(oldPos, found);
      }
    } else {
      this.notFound(playlist);
    }
  }

  public newPlaylist(name: string): Playlist {
    const playlists = this.load();
    const newPlaylist = new Playlist(name, []);
    if (this.findPlaylist(newPlaylist, playlists)) {
      throw new Error('A playlist with name ' + newPlaylist.name + ' already exists.');
    } else {
      playlists.push(newPlaylist);
      this.save(playlists);
    }
    return newPlaylist;
  }

  public removeTrack(playlist: Playlist, pos: number): void {
    const playlists = this.load();
    const found = this.findPlaylist(playlist, playlists);
    if (found) {
      if (pos >= 0 && pos < found.tracks.length) {
        found.tracks.splice(pos, 1);
        this.save(playlists);
      } else {
        this.outOfBounds(pos, found);
      }
    } else {
      this.notFound(playlist);
    }
  }

  private load(): Playlist[] {
    return JSON.parse(localStorage.getItem('playlists') || '[]').map((playlist: string) => {
      return Playlist.deserialize(playlist);
    });
  }

  private save(playlists: Playlist[]): void {
    localStorage.setItem('playlists', JSON.stringify(playlists.map((playlist: Playlist) => playlist.serialize())));
  }

  private findPlaylist(playlist: Playlist, playlists: Playlist[]): Playlist {
    return playlists.find((pl) => pl.name === playlist.name);
  }

  private notFound(playlist: Playlist): void {
    throw new Error('No playlist with name ' + playlist.name + ' found.');
  }

  private outOfBounds(pos: number, playlist: Playlist): void {
    throw new Error('The playlist ' + playlist.name + ' does not have a track at position ' + pos + '.');
  }
}
