#!/usr/bin/node

import * as express from 'express';
import * as cors from 'cors';

const PORT = 6113;

function init() {
  const app = express();

  app.use(cors());

  app.get('/api/search/', (req, res) => {
    const query = req.query.q;
    const results = [];
    // TODO
    res.json(results);
  });

  app.listen(PORT, () => {
    console.log(`search-service: listening on localhost:${PORT}`);
  });
}

init();
