import { SpotifyClient } from "./spotify-client"
import { debounce } from "./debounce"

const searchInput = document.getElementById("search-input") as HTMLInputElement
searchInput.value = ""
searchInput.addEventListener("input", onSearchInput)

const searchResults = document.getElementById("search-results")

async function onSearchInput() {
  debounce(debouncedSpotifySearch, 300, "search-input-debouncer")
}

async function debouncedSpotifySearch() {
  const val = searchInput.value
  if (!val) {
  } else {
    const tracks = await SpotifyClient.getInstance().search(val)
    searchResults.innerHTML = ""
    for (const track of tracks) {
      searchResults.appendChild(track.render())
    }
  }
}
