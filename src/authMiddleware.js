function authMiddleware(req, res) {
  const accountLinkingToken = req.query.account_linking_token;
  const redirectURI = req.query.redirect_uri;

  // Authorization Code should be generated per user by the developer. This will
  // be passed to the Account Linking callback.
  const authCode = "1234567890";

  // Redirect users to this URI on successful login
  const redirectURISuccess = redirectURI + "&authorization_code=" + authCode;

  res.render('authorize', {
    accountLinkingToken: accountLinkingToken,
    redirectURI: redirectURI,
    redirectURISuccess: redirectURISuccess
  });
}

module.exports = authMiddleware;
