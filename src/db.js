const mariadb = require('mariadb');
const config = require('./config');
const db = mariadb.createPool(config.db);

db.getConnection()
  .then(conn => {
    console.log('Connected to MariaDB database');
  })
  .catch(err => {
    throw err;
  });

module.exports = db;
