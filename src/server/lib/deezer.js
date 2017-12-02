import fetch from 'node-fetch';

const SEARCH_URL = 'https://api.deezer.com/search';

async function search(text) {
  const encodedQuery = encodeURIComponent(text);
  const url = `${SEARCH_URL}?q=${encodedQuery}`;
  const response = await fetch(url);
  return response.json();
}

module.exports = {
  search(text) {
    return search(text);
  }
};
