require('dotenv').config();

module.exports = {
  port: process.env.PORT,
  db: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    connectionLimit: 5,
    reconnect: true,
  },
  sendgrid: {
    API_KEY: process.env.SG_API_KEY,
    SENDER_EMAIL: process.env.SG_SENDER_EMAIL,
  },
};
