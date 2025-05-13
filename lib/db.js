const mysql = require('mysql2');
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 's0obang1121',
    database: 'sonsaekim',
    port: 3306
});
db.connect();
module.exports = db;