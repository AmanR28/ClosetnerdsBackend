// const mysql = require('mysql');
// const config = require('./config')
// const db = mysql.createConnection(config.db);

// db.connect((err) => {
//     if (err) {throw err;}
//     console.log('Connected to database');
// });

// module.exports = db;




const mariadb = require('mariadb');
const config = require('./config')
const db = mariadb.createPool(config.db);

db.getConnection()
    .then(conn => {
        console.log("Connected to MariaDB database");
    })
    .catch(err => {
        throw err;
    });

module.exports = db;
