'use strict';

const bodyParser = require('body-parser');
const config = require('config');
const express = require('express');
const https = require('https');
const request = require('request');
const authMiddleware = require('./src/authMiddleware');
const webhook = require('./src/webhook');
const verifyRequestSignature = require('./src/verifyRequestSignature');

const app = express();
app.set('port', config.get('port'));
app.set('view engine', 'ejs');
app.use(bodyParser.json({ verify: verifyRequestSignature }));

app.get('/webhook', webhook.validationMiddleware);
app.post('/webhook', webhook.commonMiddleware);
app.get('/authorize', authMiddleware);

app.listen(app.get('port'), function () {
  console.log('Node app is running on port', app.get('port'));
});

module.exports = app;

