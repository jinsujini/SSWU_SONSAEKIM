const mysql = require('mysql2');
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'igh100100',
    database: 'sonsaekim',
    port: 3306
});
db.connect();
module.exports = db;