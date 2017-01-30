'use strict';

const crypto = require('crypto');
const config = require('config');

/*
 * Verify that the callback came from Facebook. Using the App Secret from
 * the App Dashboard, we can verify the signature that is sent with each
 * callback in the x-hub-signature field, located in the header.
 *
 * https://developers.facebook.com/docs/graph-api/webhooks#setup
 *
 */
function verifyRequestSignature(req, res, buf) {
  const signature = req.headers["x-hub-signature"];

  if (signature) {
    const signatureHash = signature.split('=')[1];

    const expectedHash = crypto
      .createHmac('sha1', config.get('facebook.appSecret'))
      .update(buf)
      .digest('hex');

    if (signatureHash == expectedHash) {
      return;
    }
  }

  throw new Error("Couldn't validate the request signature.");
}

module.exports = verifyRequestSignature;
