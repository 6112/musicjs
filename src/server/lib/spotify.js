const fetch = require('node-fetch');

const CLIENT_ID = 'af1d0f4923bc4391a7bcd1f14f66a051';
const CLIENT_SECRET = 'e281a32169f54b0685179322910ceca2';

const API_TOKEN_URL = 'https://accounts.spotify.com/api/token';

let authToken = null;

function fetchAuthToken() {
  const base64ClientInfo = new Buffer(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');
  return fetch(API_TOKEN_URL, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${base64ClientInfo}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: 'grant_type=client_credentials'
  }).then((response) => response.json())
    .then((json) => {
      if (json.error) {
        return Promise.reject(new Error(json.error));
      }
      authToken = json.access_token;
      // refresh token when it expires
      setTimeout(fetchAuthToken, json.expires_in * 1000);
      return authToken;
    });
}

module.exports = {
  getAuthToken() {
    if (authToken) {
      return Promise.resolve(authToken);
    }
    return fetchAuthToken();
  }
};
