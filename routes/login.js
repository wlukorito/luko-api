const express = require('express');
const Router = express.Router();
const Connection = require('../db_connection');
//TODO: integrate jwt

Router.post('/', (req, res) => {
    if (!req.body.username || !req.body.password)
        return res.status(400).send('Username and password are mandatory');
    //get user data
    const { username, password } = req.body;
    //TODO: bcrypt user password here
    //get db user
    Connection.query(
        'SELECT * FROM dms_users WHERE username = ?',
        [username],
        (error, rows, fields) => {
            if (error)
                return res
                    .status(500)
                    .send('Ooh snapp! Something bad happened');
            //if records present
            if (rows.length) {
                const record = rows[0];
                //compare db pass with bcrypted user pass
                if (record.password === password) {
                    if (record.profile === 1) {
                        //admin login
                        const adminMenu = [
                            'Users',
                            'Profile',
                            'Upload',
                            'Uploads',
                            'Finished',
                            'Stats'
                        ];
                        const userData = { ...record, password: '' }; //nullify password
                        return res.send({ userData, menu: adminMenu });
                    } else {
                        //client login
                        const clientMenu = [
                            'Profile',
                            'Upload',
                            'Uploads',
                            'Finished'
                        ];
                        const userData = { ...record, password: '' }; //nullify password
                        return res.send({ userData, menu: clientMenu });
                    }
                }
                //incorrect pass
                return res.status(400).send('Incorrect password');
            }
            //user does not exist
            return res.status(404).send('User does not exist');
        }
    );
});

module.exports = Router;
