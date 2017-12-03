#!/usr/bin/node

import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';

import { createPlaylistSet, getPlaylistSet, updatePlaylistSet, Playlist } from './lib/playlistset';

const PORT = 6112;

function init() {
  const app = express();

  app.use(bodyParser.json());
  app.use(cors());

  // https://en.wikipedia.org/wiki/Representational_state_transfer#Relationship_between_URL_and_HTTP_methods

  // CREATE a new playlist list
  app.post('/api/playlistsets/', (req, res) => {
    const id = createPlaylistSet(req.body as Playlist[]);
    res.send(id + '');
  });

  // GET a playlist set
  app.get('/api/playlistsets/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const playlists = getPlaylistSet(id);
    res.json(playlists);
  });

  // UPDATE a playlist set
  app.put('/api/playlistsets/:id', (req, res) => {
    const id = parseInt(req.params.id);
    updatePlaylistSet(id, req.body as Playlist[]);
    res.send(id + '');
  });

  app.listen(PORT, () => {
    console.log(`playlist-service: listening on localhost:${PORT}`);
  });
}

init();
