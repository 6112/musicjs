#!/usr/bin/node

import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as path from 'path';

import { createPlaylistSet, getPlaylistSet, updatePlaylistSet, deletePlaylistSet, Playlist } from './lib/playlistset';

const spotify = require('./lib/spotify');
const deezer = require('./lib/deezer');

const PORT = 3000;

function init() {
  const app = express();

  app.use(bodyParser.json());

  // https://en.wikipedia.org/wiki/Representational_state_transfer#Relationship_between_URL_and_HTTP_methods

  // CREATE a new playlist list
  app.post('/api/playlistsets/', (req, res) => {
    const id = createPlaylistSet(req.body as Playlist[]);
    console.log(JSON.stringify(req.body));
    res.send(id + '');
  });

  // GET a playlist set
  app.get('/api/playlistsets/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const playlists = getPlaylistSet(id);
    console.log('playlists: ', playlists);
    res.json(playlists);
  });

  // UPDATE a playlist set
  app.put('/api/playlistsets/:id', (req, res) => {
    const id = parseInt(req.params.id);
    updatePlaylistSet(id, req.body as Playlist[]);
    res.send(id + '');
  });

  app.get('/spotify_auth_token', (req, res) => {
    spotify.getAuthToken().then((token) => {
      res.send(token);
    }).catch((err) => {
      res.status(500).send(err.message);
    });
  });

  app.get('/deezer_search', (req, res) => {
    deezer.search(req.query.text).then((results) => {
      res.send(results);
    }).catch((err) => {
      res.status(500).send(err.message);
    })
  });

  app.use(express.static(path.resolve(__dirname, '../../public')));
  app.use(express.static(path.resolve(__dirname, '../browser')));

  app.use((req, res) => {
    res.sendFile(path.resolve(__dirname, '../../public/index.html'));
  });

  app.listen(PORT, () => {
    console.log(`Listening on localhost:${PORT}`);
  });
}

init();
