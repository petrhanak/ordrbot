const accounts = {};

function add(psid, accessToken) {
  accounts[psid] = accessToken
}

function remove(psid) {
  delete accounts[psid]
}

function get(psid) {
  return accounts[psid]
}

module.exports.add = add;
module.exports.get = get;
module.exports.remove = remove;
