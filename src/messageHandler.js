'use strict';

const config = require('config');
const request = require('request');
const response = require('./response');
const linkingAccounts = require('./linkingAccounts');
const fbApi = require('./fbApi');

const text = response.text;
const template = response.template;
const SERVER_URL = config.get('serverURL');

const messageHandler = send => ({
  message(event) {
    send(
      text(`Linking status: ${linkingAccounts.get(event.sender.id)}`)
    );
    send(
      text(`Neumím si povídat, jsem ještě moc malý bot :(`)
    );
  },
  postback(event) {
    switch (event.postback.payload) {
      case 'GET_STARTED':
        this.flow.intro();
        break;
      case 'CREATE_ORDER':
        this.flow.login();
        break;
      case 'UNLINK_ACCOUNT':
        fbApi.unlinkAccount(event.sender.id);
        break;
      default:
    }
  },
  accountLink(event) {
    switch (event.account_linking.status) {
      case 'linked':
        linkingAccounts.add(event.sender.id, event.account_linking.authorization_code);
        break;
      case 'unlinked':
        linkingAccounts.remove(event.sender.id);
        break;
      default:
    }
    send(
      text(`Linking status: ${event.account_linking.status}`)
    );
  },
  flow: {
    intro: () => {
      send(
        text(`Ahoj, jsem ordrbot. Pomůžu ti objednat si jídlo.`)
      );
    },
    login: () => {
      send(
        template({
          template_type: "button",
          text: "Přihlaš se prosím do svého ordr účtu.",
          buttons: [{
            type: "account_link",
            title: "Přihlásit se",
            url: `${SERVER_URL}/authorize`
          }]
        })
      );
    }
  }
});

module.exports = messageHandler;
