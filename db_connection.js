const mysql = require('mysql');

//alter db user to use native password like this:
//  ALTER USER 'my_username'@'my_host' IDENTIFIED WITH 'mysql_native_password' BY 'my_password';
const Connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Wabo_90_mba*#',
    database: 'cwk_dms',
    multipleStatements: true
});

Connection.connect(error => {
    if (!error) console.log('Connected.');
    else console.log(`Connection failed!!: ${error}`);
});

module.exports = Connection;
