'use strict';

const response = require('./response');
const textMessage = response.textMessage;

const messageHandler = send => ({
  message(event) {
    send(
      textMessage(`Neumím si povídat, jsem ještě moc malý bot :(`)
    );
  },
  postback(event) {
    switch (payload) {
      case 'GET_STARTED':
        this.flow.intro();
        break;
      default:
    }
  },
  accountLink(event) {

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
