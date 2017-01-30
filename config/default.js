module.exports = {
  database: {
    host: process.env.DB_HOST,
    name: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
  },
  facebook: {
    appSecret: process.env.FB_APP_SECRET,
    pageAccessToken: process.env.FB_PAGE_ACCESS_TOKEN,
    validationToken: process.env.FB_VALIDATION_TOKEN,
  },
  serverURL: "https://ordrbot.herokuapp.com/",
  port: process.env.PORT || 5000
};
