import { SearchManager } from './search-manager';
import { MockFetcher } from './api/fetch';
import { SpotifyTokenManager } from './api/spotify-api';

QUnit.module('SearchManager');

QUnit.test('should search through all the APIs', async (assert) => {
  const fetcher = new MockFetcher();
  const tokenManager = new SpotifyTokenManager();
  const searchManager = new SearchManager(fetcher, tokenManager);
  const genericResponse = JSON.stringify({
    tracks: {
      items: [
        {
          id: '',
          name: '',
          artists: [
            {
              id: '',
              name: '',
              external_urls: {
                spotify: ''
              }
            }
          ],
          duration_ms: 0,
          preview_url: 'something',
          external_urls: {
            spotify: ''
          },
          uri: ''
        }
      ]
    },
    results: [
      {
        name: '',
        artist_name: '',
        duration: 0,
        audio: 'something'
      }
    ],
    data: [
      {
        title: '',
        preview: 'something',
        artist: {
          name: ''
        },
        duration: 0
      }
    ]
  });
  fetcher.pushResponse(new Response(genericResponse));
  fetcher.pushResponse(new Response(genericResponse));
  fetcher.pushResponse(new Response(genericResponse));
  const results = await searchManager.search('abc');
  const expectedNumberOfResults = 3;
  assert.deepEqual(results.length, expectedNumberOfResults);
});
