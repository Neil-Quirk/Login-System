//Create our server

const express = require('express');

const bodyParser = require('body-parser');

const app = express();

const ports = process.env.PORT || 3000;

//Middleware MVC pattern
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.listen(ports, () => console.log(`Listening on port ${ports}`));