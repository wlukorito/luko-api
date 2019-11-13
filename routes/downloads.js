const express = require('express');
const Router = express.Router();
// const path = require('path');

Router.get('/', (req, res) => {
    const url = `./repository/${req.query.url}`;
    res.download(url);
    // res.send(url);
    console.log(url);
});

module.exports = Router;
