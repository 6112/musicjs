import { SpotifyApi, SpotifyTokenManager } from "./spotify-api"
import { FetchApiFetcher } from "./fetch"
import { debounce } from "./debounce"

const searchInput = document.getElementById("search-input") as HTMLInputElement
searchInput.value = ""
searchInput.addEventListener("input", onSearchInput)

const searchResults = document.getElementById("search-results")

async function onSearchInput() {
  debounce(debouncedSpotifySearch, 300, "search-input-debouncer")
}

const fetcher = new FetchApiFetcher()
const spotifyTokenManager = new SpotifyTokenManager()
const spotify = new SpotifyApi(fetcher, spotifyTokenManager)

async function debouncedSpotifySearch() {
  const val = searchInput.value
  if (!val) {
  } else {
    const tracks = await spotify.search(val)
    console.log(tracks)
    searchResults.innerHTML = ""
    for (const track of tracks) {
      searchResults.appendChild(track.render())
    }
  }
}
