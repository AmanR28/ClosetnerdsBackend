require('dotenv').config();

module.exports = {
  port: process.env.PORT,
  TOKEN: {
    SECRET_KEY: process.env.SECRET_KEY,
    EXPIRE_TIME: 3600,
  },
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
  template: {
    profile_registered: 'd-139a062eb046465483c55768b50afc2c',
    profile_completed: 'd-0a3dbf1b305d497a833cdcb789e0ee7d',
    user_registered: 'd-b2b2bf36cdfa4d56813eabb110f87e32',
    user_reset_password: 'd-8a4f0312002f41c2a3332e3bef7b668b',
  },
};
