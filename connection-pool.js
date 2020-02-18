const mysql = require('mysql');

const Pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'cwk_dms',
    multipleStatements: true
});

module.exports = Pool;
