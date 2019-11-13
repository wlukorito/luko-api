const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
//apply cors Middleware
app.use(cors());

//custom imports
const Connection = require('./db_connection');
const uploadRoutes = require('./routes/uploads');
const downloadRoutes = require('./routes/downloads');
const usersRoutes = require('./routes/users');
const loginRoutes = require('./routes/login');

//handle uploads routes
app.use('/upload', uploadRoutes);
app.use('/download', downloadRoutes);
app.use('/users', usersRoutes);
app.use('/login', loginRoutes);

/*app.post('/login', (req, res) => {
    console.log(req.body);
    //Mock authentication
    if (req.body) {
        if (req.body.username === 'root' && req.body.password === 'root') {
            const adminMenu = ['Users', 'Profile', 'Upload', 'Uploads', 'Finished', 'Stats'];
            return res.status(200).send({ userId: 1, token: 'secretToken', role: 1, menu: adminMenu });
        } else if (req.body.username === 'client' && req.body.password === 'client') {
            const clientMenu = ['Profile', 'Upload', 'Uploads', 'Finished'];
            return res.status(200).send({ userId: 2, token: 'secretToken', role: 2, menu: clientMenu });
        }

        return res.status(404).send('Invalid username or password');
    }
    res.status(500).send('Username and password are mandatory');
}); */

//Checks db connection
app.get('/check', (req, res) => {
    // console.log(req);
    Connection.query('SELECT * FROM dms_status', (error, rows, fields) => {
        if (!error) {
            res.send(rows);
        } else {
            console.log('An error occured');
            res.status(400).send('An error occured during the request');
        }
    });
});

app.listen(8000, function() {
    console.log('Server running on port 8000');
});
