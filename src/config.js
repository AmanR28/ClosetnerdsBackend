require('dotenv').config();

ENV = process.env.NODE_ENV || 'local';

let GC_CALLBACK, FB_CALLBACK;
let BASE_URI, WEB_URI;

if (ENV === 'production') {
  console.log('Running In Production');
  BASE_URI = 'https://closetnerds.in/api/';
  WEB_URI = 'https://closetnerds.in/';
  GC_CALLBACK = 'https://closetnerds.in/api/auth/google/callback';
  FB_CALLBACK = 'https://closetnerds.in/api/auth/facebook/callback';
} else if (ENV === 'development') {
  console.log('Running In Development');
  BASE_URI = 'https://development.closetnerds.in/api/';
  WEB_URI = 'https://development.closetnerds.in/';
  GC_CALLBACK = 'https://development.closetnerds.in/api/auth/google/callback';
  FB_CALLBACK = 'https://development.closetnerds.in/api/auth/facebook/callback';
} else {
  console.log('Running In Local');
  BASE_URI = 'http://localhost:3000/';
  WEB_URI = 'http://localhost:4000/';
  GC_CALLBACK = 'http://localhost:3000/auth/google/callback';
  FB_CALLBACK = 'http://localhost:3000/auth/facebook/callback';
}

module.exports = {
  ENV,
  BASE_URI,
  WEB_URI,
  port: process.env.PORT,
  JWT_TOKEN: {
    SECRET_KEY: process.env.SECRET_KEY,
    EXPIRE_TIME: 2 * 60 * 60 * 1000, // 2H
  },
  db: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    connectionLimit: 5,
    reconnect: true,
    dialect: process.env.DB_DIALECT,
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
    user_reset_password_success: 'd-daf5fb25bdf8418780959691be34438e',
    email_verification: 'd-15236f3f62fc4effb48997373f3b3ec7',
  },

  GOOGLE: {
    CLIENT_ID: process.env.GC_CLIENT_ID,
    CLIENT_SECRET: process.env.GC_CLIENT_SECRET,
    CALLBACK: GC_CALLBACK,
  },

  FACEBOOK: {
    CLIENT_ID: process.env.FB_CLIENT_ID,
    CLIENT_SECRET: process.env.FB_CLIENT_SECRET,
    CALLBACK: FB_CALLBACK,
  },

  MULTER: {
    UPLOAD_PATH: process.env.UPLOAD_PATH,
  },
};
