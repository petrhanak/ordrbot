'use strict';

const fbApi = require('./fbApi');
const messageHandler = require('./messageHandler');

function validationMiddleware(req, res) {
  if (req.query['hub.mode'] === 'subscribe' &&
    req.query['hub.verify_token'] === config.get('facebook.validationToken')) {
    console.log("Validating webhook");
    res.status(200).send(req.query['hub.challenge']);
  } else {
    console.error("Failed validation. Make sure the validation tokens match.");
    res.sendStatus(403);
  }
}

function commonMiddleware(req, res) {
  var data = req.body;

  // Make sure this is a page subscription
  if (data.object == 'page') {
    // Iterate over each entry
    // There may be multiple if batched
    data.entry.forEach(function (pageEntry) {

      // Iterate over each messaging event
      pageEntry.messaging.forEach(function (messagingEvent) {
        const send = fbApi.message(messagingEvent);
        const handler = messageHandler(send);

        if (messagingEvent.message) {
          handler.message(messagingEvent);
        } else if (messagingEvent.postback) {
          handler.postback(messagingEvent);
        } else if (messagingEvent.account_linking) {
          handler.accountLink(messagingEvent);
        } else {
          console.log("Webhook received unknown messagingEvent: ", messagingEvent);
        }
      });
    });

    // Assume all went well.
    //
    // You must send back a 200, within 20 seconds, to let us know you've
    // successfully received the callback. Otherwise, the request will time out.
    res.sendStatus(200);
  }
}

module.exports.validationMiddleware = validationMiddleware;
module.exports.commonMiddleware = commonMiddleware;
