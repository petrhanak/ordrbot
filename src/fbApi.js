'use strict';

const config = require('config');
const request = require('request');

const PAGE_ACCESS_TOKEN = ('facebook.pageAccessToken')

/*
 * Call the Send API. The message data goes in the body. If successful, we'll
 * get the message id in a response
 *
 */
const message = (messagingEvent) => (messageData) =>
  request({
    uri: 'https://graph.facebook.com/v2.6/me/messages',
    qs: { access_token: PAGE_ACCESS_TOKEN },
    method: 'POST',
    json: {
      recipient: {
        id: messagingEvent.sender.id
      },
      message: messageData
    }

  }, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      const recipientId = body.recipient_id;
      const messageId = body.message_id;

      if (messageId) {
        console.log("Successfully sent message with id %s to recipient %s",
          messageId, recipientId);
      } else {
        console.log("Successfully called Send API for recipient %s",
          recipientId);
      }
    } else {
      console.error("Failed calling Send API", response.statusCode, response.statusMessage, body.error);
    }
  });

const unlinkAccount = (PSID) =>
  request({
    uri: 'https://graph.facebook.com/v2.6/me/unlink_accounts',
    qs: { access_token: PAGE_ACCESS_TOKEN },
    method: 'POST',
    json: {
      psid: PSID,
    },
  });

module.exports.message = message;
module.exports.unlinkAccount = unlinkAccount;
