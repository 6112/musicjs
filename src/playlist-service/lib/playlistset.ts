import { LocalStorage } from 'node-localstorage';

const localStorage = new LocalStorage('./.localstorage');

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

function generateUid() {
  const uid = parseInt(localStorage.getItem('uid')) || 1;
  localStorage.setItem('uid', uid + 1);
  return uid;
}

export function createPlaylistSet(playlists: Playlist[]): number {
  const id = generateUid();
  localStorage.setItem(id + '', JSON.stringify(playlists));
  return id;
}

export function getPlaylistSet(id: number): Playlist[] {
  return JSON.parse(localStorage.getItem(id + ''));
}

export function updatePlaylistSet(id: number, playlists: Playlist[]): void {
  localStorage.setItem(id + '', JSON.stringify(playlists));
}
