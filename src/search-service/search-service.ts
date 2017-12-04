#!/usr/bin/node

import * as express from 'express';
import * as cors from 'cors';

import { SearchManager } from './managers/search-manager';
import { FetchApiFetcher } from './managers/api/fetch';
import { SpotifyTokenManager } from './managers/api/spotify-api';

const PORT = 6113;

/**
 * Query of the search.
 */
interface Query {
  q: string;
}

/**
 * A service for searching and aggregating data from multiple music
 * APIs. Exposes a simple HTTP interface.
 *
 * GET /api/search?q=look+what+you+made+me+do
 *   Search for "look what you made me do" on the 3 music APIs and return the
 *   concatenated results as an array. Each element is a serialized `Track`
 *   object (so, a string) that can be deserialized on the client side.
 */
export class SearchService {
  /** Express app for listening on HTTP. */
  private app: express.Express;

  /**
   * Constructor.
   * @param port Port number to listen on.
   */
  public constructor(private port: number) {
    this.app = express();

    this.app.use(cors());

    const fetcher = new FetchApiFetcher();
    const tokenManager = new SpotifyTokenManager();
    const searchManager = new SearchManager(fetcher, tokenManager);

    this.app.get('/api/search/', async (req, res) => {
      const query = (req.query as Query).q;
      const results = await searchManager.search(query);
      res.json(results.map((t) => t.serialize()));
    });
  }

  /**
   * Launch the HTTP server.
   */
  public listen() {
    this.app.listen(this.port);
  }
}

const service = new SearchService(PORT);
service.listen();
