'use strict'
require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const pg = require("pg");
const client = new pg.Client(process.env.DATABASE_URL);
//const data = require('./Movie Data/data.json');
const axios = require("axios");
app.use(cors());
app.use(express.json());


// ################################################################################################################
// middle wares (routes)
app.post('/addCustomer', addCustomerHandler);
app.post('/ValidationLogIn/:role', handleValidationLogIn);




// ################################################################################################################
// handlers ()
function addCustomerHandler(req, res) {
    let newCustomer = req.body;
    let sql = `INSERT INTO customers (name, email, address, password, roleId) VALUES ($1, $2, $3, $4, $5) RETURNING *`;
    let values = [newCustomer.name, newCustomer.email, newCustomer.address, newCustomer.password, 1];
    client
        .query(sql, values)
        .then(result => {
            res.send(result.rows);
        })
        .catch(error => {
            console.log("error in adding customer", error);
            res.status(500).send("An error occurred while adding customer");
        });
}
function handleValidationLogIn(req, res) {
    const roleNo = req.params.role;
    const getemail = req.body.email;
    const getpassword = req.body.password;
    if (roleNo == 1) {
        const sql = `SELECT * FROM customers WHERE email = $1 AND password = $2`;
        const values = [getemail, getpassword];
        client
            .query(sql, values)
            .then((data) => {
                console.log(data.rows.length);
                if (data.rows.length > 0) {
                    res.send("You are logged in");
                } else {
                    res.send("Invalid email or password");
                }
            })
            .catch((error) => {
                console.log(error);
                res.status(500).send("An error occurred while validating login");
            });
    }
    else if (roleNo == 2);
    {
        const sql = `SELECT * FROM employees WHERE email = $1 AND password = $2`;
        const values = [getemail, getpassword];
        client
            .query(sql, values)
            .then((data) => {
                console.log(data.rows.length);
                if (data.rows.length > 0) {
                    res.send("You are logged in");
                } else {
                    res.send("Invalid email or password");
                }
            })
            .catch((error) => {
                console.log(error);
                res.status(500).send("An error occurred while validating login");
            });
    }
}
client.connect().then(() => {
    const port = process.env.PORT;
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
    })
}).catch(() => { console.log(`error listening`) })