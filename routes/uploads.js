const express = require('express');
const multer = require('multer');
const Router = express.Router();
const Connection = require('../db_connection');

//create multer instance and specify destination
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'repository/');
    },
    filename: (req, file, cb) => {
        // cb(null, Date.now() + '-' + file.originalname);
        cb(null, req.body.title + '-' + file.originalname);
    }
});

//create upload instance and receive single file
const upload = multer({ storage: storage }).single('file');

//expose file upload endpoint
Router.post('/', (req, res) => {
    upload(req, res, err => {
        if (err instanceof multer.MulterError) {
            return res.status(500).json(err);
        } else if (err) {
            return res.status(500).json(err);
        }
        console.log(req.body);
        //Save document metadata to db

        //Process upload date
        const date = new Date();
        //month+1 = actual month, pad with 0 if is less than 10
        const month = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
        const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
        const uploadDate = `${date.getFullYear()}-${month}-${day}`;

        //access filename created by multer like: res.req.file.filename
        const url = `${res.req.file.filename}`;
        //get metadata from req
        const { title, type, owner, period, comments } = req.body;
        const sql = `INSERT INTO dms_documents (title, url, owner, status, doc_type, period, upload_date, comments) VALUES (?,?,?,?,?,?,?,?)`;
        const vals = [title, url, parseInt(owner), 21, parseInt(type), period, uploadDate, comments];
        //execute insert
        Connection.query(sql, vals, (error, result, fields) => {
            if (error) {
                console.log(error);
                return res.status(400).send('Error saving document data');
            }
            console.log(result);
            return res.status(200).send('Document data saved successfully');
        });
        // return res.status(200).send(req.file);
    });
});

Router.get('/', (req, res) => {
    console.log(req.query);
    //receive request: status: 21, userId: (1, 2, 3), role (1 admin, client otherwise)
    if (!req.query.userId || !req.query.status || !req.query.role) {
        return res.status(400).send('You must provide userId, role, and status');
    }
    //
    const sql =
        parseInt(req.query.role) === 1
            ? //admin
              `SELECT * FROM vw_dms_documents where status = ${parseInt(req.query.status)}`
            : //client
              `SELECT * FROM vw_dms_documents where owner = ${parseInt(req.query.userId)} and status = ${parseInt(
                  req.query.status
              )}`;

    //select files from db for status specified in body, owner specified in body
    Connection.query(sql, (error, rows, fields) => {
        //if error send status text (clear spinner on frontend and render error message)
        if (error) {
            console.log(error);
            return res.status(500).send('An error occured accessing the specified resource');
        }
        //else send data as array of row objects
        res.send(rows);
    });
});

//get core docs for client
Router.get('/core', (req, res) => {
    console.log(req.query);
    //receive request: status: 21, userId: (1, 2, 3), role (1 admin, client otherwise)
    if (!req.query.userId || !req.query.role) {
        return res.status(400).send('You must provide userId, role, and status');
    }
    //
    const sql =
        parseInt(req.query.role) === 1
            ? //admin
              `SELECT * FROM vw_dms_documents where doc_type = 1`
            : //client
              `SELECT * FROM vw_dms_documents where owner = ${parseInt(req.query.userId)} and doc_type = 1`;

    //select files from db for status specified in body, owner specified in body
    Connection.query(sql, (error, rows, fields) => {
        //if error send status text (clear spinner on frontend and render error message)
        if (error) {
            console.log(error);
            return res.status(500).send('An error occured accessing the specified resource');
        }
        //else send data as array of row objects
        res.send(rows);
    });
});

module.exports = Router;
