import { Router } from './components/router';
import { PlaylistListComponent } from './components/playlist-list-component';
import { SearchComponent } from './components/search-component';

const search = new SearchComponent();
const playlistList = new PlaylistListComponent();

const DEFAULT_COMPONENT = search;

const router = new Router(DEFAULT_COMPONENT);
router.register(search, playlistList);

registerNavEvents();
navigateToCurrentUrl();

function navigateToCurrentUrl() {
  const slug = window.location.pathname.substr(1);
  router.navigateTo(slug);
}

function registerNavEvents() {
  const navItems =
    document.querySelectorAll('.nav-item > a') as NodeListOf<HTMLElement>;

  for (const item of navItems) {

    item.addEventListener('click', (event: MouseEvent) => {
      router.navigateTo(item.dataset.target);
      event.preventDefault();
    });

    // Update navbar state after a route change.
    router.addEventListener('route-change', (event: CustomEvent) => {
      const parent = item.parentElement;
      if (event.detail == item.dataset.target) {
        parent.classList.add('active');
      } else {
        parent.classList.remove('active');
      }
    });

  }
}
