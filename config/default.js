'use strict';

module.exports = {
  database: {
    server: process.env.DB_HOST,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT || 1433,
    options: {
      encrypt: true
    }
  },
  facebook: {
    appSecret: process.env.FB_APP_SECRET,
    pageAccessToken: process.env.FB_PAGE_ACCESS_TOKEN,
    validationToken: process.env.FB_VALIDATION_TOKEN,
  },
  serverURL: "https://ordrbot.herokuapp.com/",
  port: process.env.PORT || 5000
};
