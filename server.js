const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
//apply cors Middleware
app.use(cors());

//custom imports
const Pool = require('./connection-pool');
const uploadRoutes = require('./routes/uploads');
const downloadRoutes = require('./routes/downloads');
const usersRoutes = require('./routes/users');
const loginRoutes = require('./routes/login');

//handle uploads routes
app.use('/upload', uploadRoutes);
app.use('/download', downloadRoutes);
app.use('/users', usersRoutes);
app.use('/login', loginRoutes);

//Checks db connection pool
app.get('/check', (req, res) => {
    // console.log(req);
    Pool.getConnection((err, Connection) => {
        //not connected
        if (err) {
            res.status(500).send('Internal server error');
            return console.log('Fatal Error when creating connection: ', err);
        }
        //connected
        Connection.query('SELECT * FROM dms_status', (error, rows, fields) => {
            //done with connection so we release it
            Connection.release();

            if (!error) {
                res.send(rows);
            } else {
                console.log('An error occured:', error);
                res.status(400).send('An error occured during the request');
            }
        });
    });
});

//checks server is up and running
app.get('/raw', (req, res) => {
    res.send('Hello, I did not crash and die!');
});

app.listen(8000, function() {
    console.log('Server running on port 8000');
});
