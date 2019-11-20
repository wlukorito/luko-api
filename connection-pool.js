const mysql = require('mysql');

const Pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: 'Wabo_90_mba*#',
    database: 'cwk_dms',
    multipleStatements: true
});

module.exports = Pool;
