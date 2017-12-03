import fetch from 'node-fetch';

const SEARCH_URL = 'https://api.deezer.com/search';

export async function search(text): Promise<any[]> {
  const encodedQuery = encodeURIComponent(text);
  const url = `${SEARCH_URL}?q=${encodedQuery}`;
  const response = await fetch(url);
  return response.json();
}
