#!/usr/bin/node

// Script pour demarrer tous les serveurs & services d'un coup. Terminer
// l'execution de ce script avec un signal (e.g. en appuyant sur Ctrl+C) pour
// tuer tous les serveurs en meme temps.
//
// L'application doit etre build avant d'executer ce script:
//
//   npm run build
//   npm run start-all

const { spawn } = require('child_process');
const path = require('path');

const executables = [
  'dist/server/server.js',
  'dist/playlist-service/playlist-service.js',
  'dist/search-service/search-service.js',
];

for (const executable of executables) {
  const command = 'node ' + path.join(__dirname, executable);
  console.log('> ' + command);
  spawn('node', [path.join(__dirname, executable)], {
    stdio: 'inherit'
  }, () => {
  });
}

