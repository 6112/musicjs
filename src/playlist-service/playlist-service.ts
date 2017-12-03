#!/usr/bin/node

import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';

import { PlaylistListManager } from './managers/playlist-list-manager';

const PORT = 6112;

/**
 * A service for persisting playlists to a database that exposes a simple
 * RESTful JSON HTTP interface.
 *
 * CREATE /api/playlistsets/
 *   Create a new entry in the database with the given JSON value, and return
 *   an ID (a number).
 *
 * GET /api/playlistsets/:id
 *   Fetch the entry with the given ID, and return the saved JSON value.
 *
 * UPDATE /api/playlistsets/:id
 *   Update the value of the entry with the given ID to the given JSON value.
 */
class PlaylistService {
  /** Express app for listening on HTTP. */
  private app: any;

  /**
   * Constructor.
   * @param port Port number to listen on.
   */
  constructor(private port: number) {
    this.app = express();

    this.app.use(bodyParser.json());
    this.app.use(cors());

    // https://en.wikipedia.org/wiki/Representational_state_transfer#Relationship_between_URL_and_HTTP_methods

    // CREATE a new playlist list
    this.app.post('/api/playlistsets/', (req, res) => {
      const id = PlaylistListManager.create(req.body as string[]);
      res.send(id + '');
    });

    // GET a playlist set
    this.app.get('/api/playlistsets/:id', (req, res) => {
      const id = parseInt(req.params.id);
      const playlists = PlaylistListManager.read(id);
      res.json(playlists);
    });

    // UPDATE a playlist set
    this.app.put('/api/playlistsets/:id', (req, res) => {
      const id = parseInt(req.params.id);
      PlaylistListManager.update(id, req.body as string[]);
      res.send(id + '');
    });
  }

  /**
   * Launch the HTTP server.
   */
  public listen() {
    this.app.listen(this.port, () => {
      console.log(`playlist-service: listening on localhost:${PORT}`);
    });
  }
}

const service = new PlaylistService(PORT);
service.listen();
