enum Provider {
  JAMENDO = 'jamendo',
  SPOTIFY = 'spotify',
  DEEZER = 'deezer'
}

interface Track {
  title: string;
  artist: string;
  album: string;
  length: number;
  uri: string;
  provider: Provider;
}

export interface Playlist {
  name: string;
  tracks: Track[];
}

let uid = 0;
const playlistsets = new Map<number, Playlist[]>();

export function createPlaylistSet(playlists: Playlist[]): number {
  const id = ++uid;
  playlistsets.set(id, playlists);
  return id;
}

export function getPlaylistSet(id: number): Playlist[] {
  return playlistsets.get(id);
}

export function updatePlaylistSet(id: number, playlists: Playlist[]): void {
  playlistsets.set(id, playlists);
}
