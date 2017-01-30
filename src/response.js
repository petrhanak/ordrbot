'use strict';

const text = messageText => ({
  text: messageText
});

const template = payload => ({
  attachment: {
    type: "template",
    payload: payload
  }
});

module.exports.text = text;
module.exports.template = template;
