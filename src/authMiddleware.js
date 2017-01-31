'use strict';

const request = require('request');

function authMiddleware(req, res) {
  const accountLinkingToken = req.query.account_linking_token;
  const redirectURI = req.query.redirect_uri;

  // Authorization Code should be generated per user by the developer. This will
  // be passed to the Account Linking callback.
  const authCode = "1234567890";

  // Redirect users to this URI on successful login
  const redirectURISuccess = redirectURI + "&authorization_code=" + authCode;

  request({
    uri: redirectURISuccess
  }, function (error, response, body) {
    if (error || response.statusCode !== 200) {
      console.error("Seding account linking request failed", response.statusCode, response.statusMessage, body.error);
    }
    res.render('authorize');
  })
}

module.exports = authMiddleware;
