import { SpotifyApi, SpotifyTokenManager } from "./spotify-api"
import { FetchApiFetcher } from "./fetch"
import { debounce } from "./debounce"
import { Track } from "./track"

const searchInput = document.getElementById("search-input") as HTMLInputElement
searchInput.value = ""
searchInput.addEventListener("input", onSearchInput)

const searchResults = document.getElementById("search-results")

function onSearchInput() {
  debounce(debouncedSpotifySearch, 300, "search-input-debouncer")
}

const fetcher = new FetchApiFetcher()
const spotifyTokenManager = new SpotifyTokenManager()
const spotify = new SpotifyApi(fetcher, spotifyTokenManager)

const trackListTemplate = Handlebars.compile(
  document.getElementById("track-list-template").innerHTML)
function renderTrackList(tracks: Track[]) {
  return trackListTemplate({
    tracks
  })
}

async function debouncedSpotifySearch() {
  const val = searchInput.value
  if (!val) {
  } else {
    const tracks = await spotify.search(val)
    console.log(tracks)
    searchResults.innerHTML = renderTrackList(tracks)
  }
}
