import { Playlist } from '../data/playlist';
import { Track } from '../data/track';
import { FetchApiFetcher, Fetcher } from './api/fetch';

const PLAYLIST_SERVICE_PORT = 6112;

const DECIMAL = 10;

/**
 * Manages playlists and their tracks.
 * Playlists are stored in localStorage.
 */
export class PlaylistManager {
  /**
   * Current state of playlists.
   */
  public static playlists: Playlist[] = null;
  /**
   * ID saved in localStorage that is sent to the playlist service with each
   * request. This allows multiple instances of the client to connect to the
   * same server, and have different lists of playlists.
   */
  public static sessionId: number =
    parseInt(localStorage.getItem('sessionId'), DECIMAL) || null;

  /**
   * Fetcher for making HTTP requests. Can be overwritten for mocking.
   */
  public static fetcher: Fetcher = new FetchApiFetcher();

  /**
   * Add a track to a playlist.
   * @param track Track to add.
   * @param playlist Playlist to add to.
   * @return Modified playlist.
   */
  public static async addToPlaylist(track: Track, playlist: Playlist): Promise<Playlist> {
    const playlists = await PlaylistManager.loadPlaylists();
    const found = PlaylistManager.findPlaylist(playlist, playlists);
    if (found) {
      found.tracks.push(track);
      await PlaylistManager.save(playlists);
      return found;
    } else {
      PlaylistManager.notFound(playlist);
    }
  }

  /**
   * Delete a playlist.
   * @param playlist Playlist to delete.
   */
  public static async deletePlaylist(playlist: Playlist): Promise<void> {
    const playlists = await PlaylistManager.loadPlaylists();
    const found = playlists.findIndex((pl) => pl.name === playlist.name);
    if (found !== -1) {
      playlists.splice(found, 1);
      await PlaylistManager.save(playlists);
    } else {
      PlaylistManager.notFound(playlist);
    }
  }

  /**
   * Load all playlists.
   * @return List of playlists.
   */
  public static async loadPlaylists(): Promise<Playlist[]> {
    if (PlaylistManager.playlists) {
      // Already loaded, just return the list of playlists immediately.
      return PlaylistManager.playlists.slice();
    }
    if (PlaylistManager.sessionId) {
      /* Not loaded, but there is an ID from a past session. We can use that ID
       * to fetch the list of playlists from the server. */
      return PlaylistManager.load();
    }
    /* Not loaded and there is no existing list of playlists on the
     * server. Create a new empty list on the server. */
    await PlaylistManager.createPlaylistSet();
    return [];
  }

  /**
   * Move a track inside a playlist.
   * @param playlist Playlist containing the track.
   * @param oldPos Current position of the track.
   * @param newPos New position of the track.
   * @return Modified playlist.
   */
  public static async moveTrack(playlist: Playlist, oldPos: number, newPos: number): Promise<Playlist> {
    const playlists = await PlaylistManager.loadPlaylists();
    const found = PlaylistManager.findPlaylist(playlist, playlists);
    if (found) {
      if (oldPos >= 0 && oldPos < found.tracks.length) {
        const track = found.tracks.splice(oldPos, 1)[0];
        found.tracks.splice(newPos, 0, track);
        await PlaylistManager.save(playlists);
        return found;
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
  public static async newPlaylist(name: string): Promise<Playlist> {
    const playlists = await PlaylistManager.loadPlaylists();
    const newPlaylist = new Playlist(name, []);
    if (PlaylistManager.findPlaylist(newPlaylist, playlists)) {
      throw new Error(`A playlist with name ${newPlaylist.name} already exists.`);
    } else {
      playlists.push(newPlaylist);
      await PlaylistManager.save(playlists);
    }
    return newPlaylist;
  }

  /**
   * Remove a track from a playlist.
   * @param playlist Playlist containing the track.
   * @param pos Position of the track to remove.
   * @return Modified playlist.
   */
  public static async removeTrack(playlist: Playlist, pos: number): Promise<Playlist> {
    const playlists = await PlaylistManager.loadPlaylists();
    const found = PlaylistManager.findPlaylist(playlist, playlists);
    if (found) {
      if (pos >= 0 && pos < found.tracks.length) {
        found.tracks.splice(pos, 1);
        await PlaylistManager.save(playlists);
        return found;
      } else {
        PlaylistManager.outOfBounds(pos, found);
      }
    } else {
      PlaylistManager.notFound(playlist);
    }
  }

  /**
   * Load all the playlists from the server.
   * @return The list of playlists.
   */
  private static async load(): Promise<Playlist[]> {
    const url = PlaylistManager.getPlaylistServiceUrl() + `/api/playlistsets/${PlaylistManager.sessionId}`;
    const response = await PlaylistManager.fetcher.fetch(url, {
      method: 'GET'
    });
    const json = await response.json() as string[];
    if (json) {
      PlaylistManager.playlists = json.map((playlist) => Playlist.deserialize(playlist));
    } else {
      PlaylistManager.playlists = [];
    }
    return PlaylistManager.playlists.slice();
  }

  /**
   * Create a new list of playlists on the server.
   */
  private static async createPlaylistSet(): Promise<void> {
    const url = PlaylistManager.getPlaylistServiceUrl() + '/api/playlistsets';
    const response = await PlaylistManager.fetcher.fetch(url, {
      method: 'POST',
      body: JSON.stringify([]),
      headers: new Headers({
        'Content-Type': 'application/json'
      })
    });
    const text = await response.text();
    PlaylistManager.sessionId = parseInt(text, DECIMAL);
    PlaylistManager.playlists = [];
    localStorage.setItem('sessionId', `${PlaylistManager.sessionId}`);
  }

  /**
   * Save a list of playlists to the server.
   * @param playlists List of playlists to save.
   */
  private static async save(playlists: Playlist[]): Promise<void> {
    const json = JSON.stringify(playlists.map((p: Playlist) => p.serialize()));
    const url = PlaylistManager.getPlaylistServiceUrl() + `/api/playlistsets/${PlaylistManager.sessionId}`;
    PlaylistManager.playlists = playlists;
    await PlaylistManager.fetcher.fetch(url, {
      method: 'PUT',
      body: json,
      headers: new Headers({
        'Content-Type': 'application/json'
      })
    });
  }

  /**
   * Return the base URL (without trailing slash) for the playlist-service
   * service.
   */
  private static getPlaylistServiceUrl(): string {
    const l = window.location;
    return `${l.protocol}//${l.hostname}:${PLAYLIST_SERVICE_PORT}`;
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
