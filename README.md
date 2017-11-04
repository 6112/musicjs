# Project Structure

* `src/client`: client source code (TypeScript)
* `src/server`: server source code (JavaScript) & public files
* `dist/browser`: compiled JS files used on the client side
* `dist/doc`: generated documentation (see generated `index.html`)
* `dist/understand`: generated JS files for analyzing in Understand

# Setup

```
npm install
```

# Building

Just run this:

```
npm run build
```

This will compile files from `src/client/` and put the .js files in
`dist/browser`, which is served by the server. This generates JS files that can
be used by the browser, but they're hard to analyze for Understand.

# Serving

To run the HTTP server, just run:

```
npm start
```

This will start a server listening on port 3000.

# Generating Documentation

To generate HTML documentation (output is placed in `dist/doc/index.html`):

```
npm run doc
```

To generate JS files that are easy for Understand to analyze (but can't run in a
browser):

```
npm run understand
```

And add the files from the `dist/understand` directory to the Understand project.

# Testing

To run unit tests for client-side code, run the server, compile the client-side
code, and open `localhost:3000/test.html` in a browser.

# Cleaning

```
npm run clean
```

# Linting

```
npm run lint
```

Please fix lint errors before committing.
