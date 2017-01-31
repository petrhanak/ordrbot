'use strict';

const orders = {};

function create(PSID) {
  orders[PSID] = {
    items: [],
    location: null
  };
}

function addItem(PSID, item) {
  orders[PSID].items.push(item);
}

function setLocation(PSID, location) {
  orders[PSID].location = location;
}

function get(PSID) {
  return orders[PSID]
}

function remove(PSID) {
  delete orders[PSID]
}

module.exports.addItem = addItem;
module.exports.setLocation = setLocation;
module.exports.get = get;
module.exports.create = create;
module.exports.remove = remove;
