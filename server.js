'use strict'
require("dotenv").config();
const pg = require("pg");
const client = new pg.Client(process.env.DATABASE_URL);
const express = require('express');
//const data = require('./Movie Data/data.json');
const app = express();
const axios = require("axios");
const cors = require('cors');
app.use(cors());
app.use(express.json());
//const moviesKey = process.env.API_KEY;
const port = process.env.PORT;
app.listen(port, () => {
    console.log('ready and listen on port', port);
});

