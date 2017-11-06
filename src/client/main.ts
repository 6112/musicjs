import { Router } from './components/router';
import { PlaylistListComponent } from './components/playlist-list-component';
import { SearchComponent } from './components/search-component';
import { PlaylistComponent } from './components/playlist-component';
import { TrackComponent } from './components/track-component';

// Create router and register components.
const search = new SearchComponent();
const playlistList = new PlaylistListComponent();
const playlist = new PlaylistComponent();
const track = new TrackComponent();

const DEFAULT_COMPONENT = search;

const router = new Router(DEFAULT_COMPONENT);
router.register(playlistList, playlist, track);

// Register nav events.
const navItems = document.querySelectorAll('.nav-item > a');

for (const item of navItems) {
  item.addEventListener('click', (event: MouseEvent) => {
    router.navigateTo((item as HTMLElement).dataset.target);
    event.preventDefault();
  });

  // Update navbar state after a route change.
  router.addEventListener('route-change', (event: CustomEvent) => {
    const parent = item.parentElement;
    if (event.detail === (item as HTMLElement).dataset.target) {
      parent.classList.add('active');
    } else {
      parent.classList.remove('active');
    }
  });
}

// Navigate to current URL.
router.navigateTo(window.location.pathname.substr(1));
