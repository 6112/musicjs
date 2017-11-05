import { Playlist } from '../data/playlist';
import { Track } from '../data/track';

/**
 * Manages playlists and their tracks.
 * Playlists are stored in localStorage.
 */
export class PlaylistManager {
  /**
   * Add a track to a playlist.
   * @param track Track to add.
   * @param playlist Playlist to add to.
   */
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

  /**
   * Delete a playlist.
   * @param playlist Playlist to delete.
   */
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

  /**
   * Load all playlists.
   * @return List of playlists.
   */
  public loadPlaylists(): Playlist[] {
    return this.load();
  }

  /**
   * Move a track inside a playlist.
   * @param playlist Playlist containing the track.
   * @param oldPos Current position of the track.
   * @param newPos New position of the track.
   */
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

  /**
   * Create a new playlist.
   * @param name Name of the new playlist.
   * @return The created playlist.
   */
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

  /**
   * Remove a track from a playlist.
   * @param playlist Playlist containing the track.
   * @param pos Position of the track to remove.
   */
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

  /**
   * Load all the playlists from localStorage.
   * @return The list of playlists.
   */
  private load(): Playlist[] {
    return JSON.parse(localStorage.getItem('playlists') || '[]').map((playlist: string) => {
      return Playlist.deserialize(playlist);
    });
  }

  /**
   * Save a list of playlists to localStorage.
   * @param playlists List of playlists to save.
   */
  private save(playlists: Playlist[]): void {
    localStorage.setItem('playlists', JSON.stringify(playlists.map((playlist: Playlist) => playlist.serialize())));
  }

  /**
   * Find a playlist in a list of playlist by name.
   * @param playlist Playlist to find.
   * @param playlists List of playlists to look into.
   * @return The playlist if found, undefined otherwise.
   */
  private findPlaylist(playlist: Playlist, playlists: Playlist[]): Playlist {
    return playlists.find((pl) => pl.name === playlist.name);
  }

  /**
   * Throws an error indicating that a particular list was not found.
   * @param playlist Playlist not found.
   */
  private notFound(playlist: Playlist): void {
    throw new Error('No playlist with name ' + playlist.name + ' found.');
  }

  /**
   * Throws an error indicating an out-of-bound access attempt in a playlist.
   * @param pos Out-of-bound position.
   * @param playlist Playlist accessed.
   */
  private outOfBounds(pos: number, playlist: Playlist): void {
    throw new Error('The playlist ' + playlist.name + ' does not have a track at position ' + pos + '.');
  }
}
