'use strict';

const orders = {};

function create(PSID) {
  orders[PSID] = {
    items: [],
    location: null,
    payment: null
  };
}

function addItem(PSID, item) {
  orders[PSID].items.push(item);
}

function setLocation(PSID, location) {
  orders[PSID].location = location;
}

function setPayment(PSID, payment) {
  orders[PSID].payment = payment;
}

function get(PSID) {
  return orders[PSID]
}

function remove(PSID) {
  delete orders[PSID]
}

module.exports.addItem = addItem;
module.exports.setLocation = setLocation;
module.exports.setPayment = setPayment;
module.exports.get = get;
module.exports.create = create;
module.exports.remove = remove;
