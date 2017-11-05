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
  public static addToPlaylist(track: Track, playlist: Playlist): void {
    const playlists = PlaylistManager.load();
    const found = PlaylistManager.findPlaylist(playlist, playlists);
    if (found) {
      found.tracks.push(track);
      PlaylistManager.save(playlists);
    } else {
      PlaylistManager.notFound(playlist);
    }
  }

  /**
   * Delete a playlist.
   * @param playlist Playlist to delete.
   */
  public static deletePlaylist(playlist: Playlist): void {
    const playlists = PlaylistManager.load();
    const found = playlists.findIndex((pl) => pl.name === playlist.name);
    if (found !== -1) {
      playlists.splice(found, 1);
      PlaylistManager.save(playlists);
    } else {
      PlaylistManager.notFound(playlist);
    }
  }

  /**
   * Load all playlists.
   * @return List of playlists.
   */
  public static loadPlaylists(): Playlist[] {
    return PlaylistManager.load();
  }

  /**
   * Move a track inside a playlist.
   * @param playlist Playlist containing the track.
   * @param oldPos Current position of the track.
   * @param newPos New position of the track.
   */
  public static moveTrack(playlist: Playlist, oldPos: number, newPos: number): void {
    const playlists = PlaylistManager.load();
    const found = PlaylistManager.findPlaylist(playlist, playlists);
    if (found) {
      if (oldPos >= 0 && oldPos < found.tracks.length) {
        const track = found.tracks.splice(oldPos, 1)[0];
        found.tracks.splice(newPos, 0, track);
        PlaylistManager.save(playlists);
      } else {
        PlaylistManager.outOfBounds(oldPos, found);
      }
    } else {
      PlaylistManager.notFound(playlist);
    }
  }

  /**
   * Create a new playlist.
   * @param name Name of the new playlist.
   * @return The created playlist.
   */
  public static newPlaylist(name: string): Playlist {
    const playlists = PlaylistManager.load();
    const newPlaylist = new Playlist(name, []);
    if (PlaylistManager.findPlaylist(newPlaylist, playlists)) {
      throw new Error(`A playlist with name ${newPlaylist.name} already exists.`);
    } else {
      playlists.push(newPlaylist);
      PlaylistManager.save(playlists);
    }
    return newPlaylist;
  }

  /**
   * Remove a track from a playlist.
   * @param playlist Playlist containing the track.
   * @param pos Position of the track to remove.
   */
  public static removeTrack(playlist: Playlist, pos: number): void {
    const playlists = PlaylistManager.load();
    const found = PlaylistManager.findPlaylist(playlist, playlists);
    if (found) {
      if (pos >= 0 && pos < found.tracks.length) {
        found.tracks.splice(pos, 1);
        PlaylistManager.save(playlists);
      } else {
        PlaylistManager.outOfBounds(pos, found);
      }
    } else {
      PlaylistManager.notFound(playlist);
    }
  }

  /**
   * Load all the playlists from localStorage.
   * @return The list of playlists.
   */
  private static load(): Playlist[] {
    const parsed = JSON.parse(localStorage.getItem('playlists') || '[]') as string[];
    return parsed.map((playlist) => Playlist.deserialize(playlist));
  }

  /**
   * Save a list of playlists to localStorage.
   * @param playlists List of playlists to save.
   */
  private static save(playlists: Playlist[]): void {
    localStorage.setItem('playlists', JSON.stringify(playlists.map((playlist: Playlist) => playlist.serialize())));
  }

  /**
   * Find a playlist in a list of playlist by name.
   * @param playlist Playlist to find.
   * @param playlists List of playlists to look into.
   * @return The playlist if found, undefined otherwise.
   */
  private static findPlaylist(playlist: Playlist, playlists: Playlist[]): Playlist {
    return playlists.find((pl) => pl.name === playlist.name);
  }

  /**
   * Throws an error indicating that a particular list was not found.
   * @param playlist Playlist not found.
   */
  private static notFound(playlist: Playlist): void {
    throw new Error(`No playlist with name ${playlist.name} found.`);
  }

  /**
   * Throws an error indicating an out-of-bound access attempt in a playlist.
   * @param pos Out-of-bound position.
   * @param playlist Playlist accessed.
   */
  private static outOfBounds(pos: number, playlist: Playlist): void {
    throw new Error(`The playlist ${playlist.name} does not have a track at position ${pos}.`);
  }
}
