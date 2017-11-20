# Project Structure

* `src/client`: client source code (TypeScript)
* `src/server`: server source code (JavaScript) & public files
* `dist/browser`: compiled JS files used on the client side
* `dist/coverage`: test coverage results (see generated `index.html`)
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

To generate JS files that are easy for Understand to analyze (but can't run in a
browser):

```
npm run understand
```

And add the files from the `dist/understand` directory to the Understand project.

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

# Testing

```
npm run test
```

This will run all the unit tests and will verify that the coverage is above 50% for statements and lines. Note that the coverage is calculated on the generated JavaScript files, and not the TypeScript files.

# Cleaning

```
npm run clean
```

# Linting

```
npm run lint
```

Please fix lint errors before committing.
