'use strict';

const config = require('config');
const request = require('request');
const response = require('./response');
const linkingAccounts = require('./linkingAccounts');
const fbApi = require('./fbApi');
const order = require('./order');

const text = response.text;
const template = response.template;
const SERVER_URL = config.get('serverURL');

const messageHandler = send => ({
  message(event) {
    send(
      text(
        JSON.stringify(event)
      )
    );

    const options = [
      'Neumím si povídat, jsem ještě moc malý bot 😕',
      "Já nerozumět řeči tvého kmene 😳"
    ];

    // send random option
    send(
      text(
        options[Math.floor(Math.random() * options.length)]
      )
    );
  },
  postback(event) {
    const payload = event.postback.payload.split(':');
    const PSID = event.sender.id;
    switch (payload[0]) {
      case 'GET_STARTED':
        this.flow.intro();
        this.flow.order(event);
        break;
      case 'CREATE_ORDER':
        this.flow.order(event);
        order.create(PSID);
        break;
      case 'UNLINK_ACCOUNT':
        send(
          text(`Třeba si ještě napíšeme... někdy 💔 😢`)
        );
        fbApi.unlinkAccount(PSID);
        break;
      case 'ORDER_ITEM':
        const itemId = payload[1];
        send(
          text(`Přidal jsem položku #${itemId} do košíku`)
        );
        order.addItem(PSID, itemId);
        break;
      case 'FINISH_ORDER':
        const basket = order.get(PSID).items;
        if (basket.length < 1) {
          send(
            text(`Prázdný košík znamená prázdné břicho. Něco si vyber.`)
          );
        } else {
          this.flow.listLocations()
        }
        break;
      case 'SELECT_LOCATION':
        order.setLocation(PSID, payload[1]);
        this.flow.listPayment();
        break;
      case 'SELECT_LOCATION_CUSTOM':
        this.flow.customLocation();
        break;
      case 'SELECT_PAYMENT':
        order.setLocation(PSID, payload[1]);
        this.flow.sendReceipt();
        break;
      default:
    }
  },
  accountLink(event) {
    switch (event.account_linking.status) {
      case 'linked':
        linkingAccounts.add(event.sender.id, event.account_linking.authorization_code);
        // login successful
        send(
          text(`Díky <3`)
        );
        send(
          text(`Zapamatoval jsem si tvé údaje. Pro další objednávky proběhne přihlášení automaticky 😉`)
        );
        this.flow.listMenu();
        break;
      case 'unlinked':
        linkingAccounts.remove(event.sender.id);
        break;
      default:
    }
  },
  flow: {
    intro() {
      send(
        text(`Ahoj, jsem ordrbot. Pomůžu ti objednat si jídlo. 😉`)
      );
    },
    order(event) {
      if (linkingAccounts.get(event.sender.id) === undefined) {
        this.login();
      } else {
        this.listMenu();
      }
    },
    login() {
      send(
        template({
          template_type: "button",
          text: "Připoj si prosím svůj ordr účet.",
          buttons: [{
            type: "account_link",
            url: `${SERVER_URL}/authorize`
          }]
        })
      );
    },
    listMenu() {
      send(
        text(`Tohle je dnešní menu 😋`)
      );
      send(
        template({
          template_type: "list",
          top_element_style: "compact",
          elements: [
            {
              "title": "Grilovaný kuřecí steak v zázvorové omáčce se zeleninou a rýží",
              "image_url": "https://ordrstorageproduction.blob.core.windows.net/food-pictures/Big-b39effe1-8d3b-406b-b2ab-f6c299f1cd83.jpeg",
              "buttons": [{
                "title": "Objednat za 140 Kč",
                "type": "postback",
                "payload": "ORDER_ITEM:1"
              }],
            },
            {
              "title": "Marocký salát s pohankou a pečeným květákem, jogurtový dip",
              "image_url": "https://ordrstorageproduction.blob.core.windows.net/food-pictures/Big-baecf8ed-d2be-4332-bec8-d75d9a5ac00e.jpeg",
              "buttons": [{
                "title": "Objednat za 150 Kč",
                "type": "postback",
                "payload": "ORDER_ITEM:2"
              }]
            }, {
              "title": "Čistá jablečná nefiltrovaná šťáva",
              "image_url": "https://ordrstorageproduction.blob.core.windows.net/food-pictures/Big-c0aacd35-713b-4b7c-964a-31ad1dc7a7b1.jpeg",
              "buttons": [{
                "title": "Objednat za 40 Kč",
                "type": "postback",
                "payload": "ORDER_ITEM:3"
              }]
            }, {
              "title": "Limonáda Divoženka",
              "image_url": "https://ordrstorageproduction.blob.core.windows.net/food-pictures/Big-55a68cd5-685b-476a-8687-de12e866b6c4.jpeg",
              "buttons": [{
                "title": "Objednat za 55 Kč",
                "type": "postback",
                "payload": "ORDER_ITEM:4"
              }]
            }
          ],
          buttons: [
            {
              "title": "Dokončit objednávku",
              "type": "postback",
              "payload": "FINISH_ORDER"
            }
          ]
        })
      )
    },
    listLocations() {
      send(
        template({
          "template_type": "button",
          "text": "Kam ti máme jídlo přivézt?",
          "buttons": [
            {
              "type": "postback",
              "title": "Roháčova 177/7",
              "payload": "SELECT_LOCATION:Roháčova 177/7"
            },
            {
              "type": "postback",
              "title": "Rohanské nábřeží 23",
              "payload": "SELECT_LOCATION:Rohanské nábřeží 23"
            },
          ],
          "quick_replies": [
            {
              "content_type": "text",
              "title": "Jiná adresa",
              "payload": "SELECT_LOCATION_CUSTOM"
            },
          ]
        })
      )
    },
    customLocation() {
      send({
        "text": "Kde si chceš převzít jídlo od kurýra?",
        "quick_replies": [{
          "content_type": "location",
        }]
      })
    },
    listPayment() {
      send(
        template({
          "template_type": "button",
          "text": "Jak si přeješ zaplatit?",
          "buttons": [
            {
              "type": "postback",
              "title": "Kartou",
              "payload": "SELECT_PAYMENT:creditCard"
            },
            {
              "type": "postback",
              "title": "Hotově",
              "payload": "SELECT_PAYMENT:cash"
            }
          ]
        })
      )
    },
    sendReceipt() {
    }
  }
});

module.exports = messageHandler;
