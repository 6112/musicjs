#!/usr/bin/node

import * as express from 'express';
import * as cors from 'cors';

import { SearchManager } from './managers/search-manager';
import { FetchApiFetcher } from './managers/api/fetch';
import { SpotifyTokenManager } from './managers/api/spotify-api';

const PORT = 6113;

function init() {
  const app = express();

  app.use(cors());

  const fetcher = new FetchApiFetcher();
  const tokenManager = new SpotifyTokenManager();
  const searchManager = new SearchManager(fetcher, tokenManager);

  app.get('/api/search/', async (req, res) => {
    const query = req.query.q;
    const results = await searchManager.search(query);
    res.json(results.map(t => t.serialize()));
  });

  app.listen(PORT, () => {
    console.log(`search-service: listening on localhost:${PORT}`);
  });
}

init();
