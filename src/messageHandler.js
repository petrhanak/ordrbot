'use strict';

const request = require('request');
const response = require('./response');
const linkingAccounts = require('./linkingAccounts');
const fbApi = require('./fbApi');
const textMessage = response.textMessage;

const messageHandler = send => ({
  message(event) {
    send(
      textMessage(`Neumím si povídat, jsem ještě moc malý bot :(`)
    );
  },
  postback(event) {
    switch (event.postback.payload) {
      case 'GET_STARTED':
        this.flow.intro();
        // this.flow.login();
        break;
      case 'UNLINK_ACCOUNT':
        fbApi.unlinkAccount(event.sender.id);
        break;
      default:
    }
  },
  accountLink(event) {
    send(
      textMessage(`Linking status: ${event.account_linking.status}`)
    );
  },
  flow: {
    intro: () => {
      send(
        textMessage(`Ahoj, jsem ordrbot. Pomůžu ti objednat si jídlo.`)
      );
    }
  }
});

module.exports = messageHandler;
