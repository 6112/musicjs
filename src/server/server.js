#!/usr/bin/node

const express = require('express');
const path = require('path');

const spotify = require('./lib/spotify');
const deezer = require('./lib/deezer');

const PORT = 3000;

function init() {
  const app = express();

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

  app.use(express.static(path.resolve(__dirname, 'public')));
  app.use(express.static(path.resolve(__dirname, '../../dist/browser')));

  app.use((req, res) => {
    res.sendFile(path.resolve(__dirname, 'public/index.html'));
  });

  app.listen(PORT, () => {
    console.log(`Listening on localhost:${PORT}`);
  });
}

init();
