const mysql = require('mysql');
const config = require('./config')
const db = mysql.createConnection(config.db);

db.connect((err) => {
    if (err) {throw err;}
    console.log('Connected to database');
});

module.exports = db;