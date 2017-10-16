# Project Structure

* `src`: all source code
* `src/client`: client source code (TypeScript)
* `src/server`: server source code (JavaScript) & public files

# Setup

```
npm install
```

# Building

Just run this:

```
./node_modules/.bin/gulp
```

This will compile files from `client/` and put the .js files in `dist/`, which
is served by the server. This generates JS files that can be used by the
browser, but they're hard to analyze for Understand.

# Serving

To run the HTTP server, just run:

```
node src/server/server.js
```

This will start a server listening on port 3000.

# Generating Documentation

To generate HTML documentation (output is placed in `doc/index.html`):

```
./node_modules/.bin/gulp doc
```

To generate JS files that are easy for Understand to analyze (but can't run in a
browser):

```
./node_modules/.bin/gulp understand
```

And add the files from the `understand` directory to the Understand project.

# Cleaning

```
./node_modules/.bin/gulp clean
```
