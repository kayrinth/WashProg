const { google } = require("googleapis");
const { googleClientId, googleClientSecret } = require("./env");

const oauth2Client = new google.auth.OAuth2(
  googleClientId,
  googleClientSecret,
  `http://localhost:8080/api/v1/user/google/callback`
);

module.exports = oauth2Client;
