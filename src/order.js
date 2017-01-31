'use strict';

const baskets = {};

function create(PSID) {
  baskets[PSID] = {
    items: [],
    location: null
  };
}

function addItem(PSID, item) {
  baskets[PSID].items.push(item);
}

function setLocation(PSID, location) {
  baskets[PSID].location = location;
}

function get(PSID) {
  return baskets[PSID]
}

function remove(PSID) {
  delete baskets[PSID]
}

module.exports.addItem = addItem;
module.exports.setLocation = setLocation;
module.exports.get = get;
module.exports.create = create;
module.exports.remove = remove;
