'use strict';

const text = messageText => ({
  message: {
    text: messageText
  }
});

const template = payload => ({
  message: {
    attachment: {
      type: "template",
      payload: payload
    }
  }
});

const typingOn = {
  sender_action: "typing_on"
};

const typingOff = {
  sender_action: "typing_off"
};

module.exports.text = text;
module.exports.template = template;
module.exports.typing = {
  on: typingOn,
  off: typingOff
};
