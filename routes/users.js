const express = require('express');
const Router = express.Router();
const Connection = require('../db_connection');

Router.post('/', (req, res) => {
    //destructure values from request body
    const {
        clientName,
        username,
        password,
        email,
        phone,
        address,
        industry,
        taxObligation,
        taxStatus,
        fees,
        statement,
        comments
    } = req.body;
    //join tax obligation items
    const tax_ob = taxObligation.join('-');

    //check if username exists

    //create insert query
    const sql = `INSERT INTO dms_users 
    (username, password, fullname, email, phone, address, industry, tax_obligation, 
        tax_status, fees_charged, statement, profile, comments)
    VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)`;
    //query params: default profile = 2: client
    const values = [
        username,
        password,
        clientName,
        email,
        phone,
        address,
        industry,
        tax_ob,
        taxStatus,
        parseInt(fees),
        parseInt(statement),
        2,
        comments
    ];
    //execute insert
    Connection.query(sql, values, (error, result, fields) => {
        if (error) {
            console.log(error);
            return res.status(500).send('Error creating user');
        }

        res.status(200).send('Client created successfully');
    });
});

module.exports = Router;
