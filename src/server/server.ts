#!/usr/bin/node

import * as express from 'express';
import * as path from 'path';

const PORT = 3000;

/**
 * HTTP server for serving static files.
 */
class HttpServer {
  /** Express app for listening on HTTP. */
  private app: express.Express;

  /**
   * Constructor.
   * @param port Port number to listen on.
   */
  public constructor(private port: number) {
    this.app = express();

    this.app.use(express.static(path.resolve(__dirname, '../../public')));
    this.app.use(express.static(path.resolve(__dirname, '../browser')));

    this.app.use((req, res) => {
      res.sendFile(path.resolve(__dirname, '../../public/index.html'));
    });
  }

  /**
   * Launch the HTTP server.
   */
  public listen() {
    this.app.listen(this.port);
  }
}

const server = new HttpServer(PORT);
server.listen();
