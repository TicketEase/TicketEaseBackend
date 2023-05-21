'use strict'
require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const pg = require("pg");
const client = new pg.Client(process.env.DATABASE_URL);
const axios = require("axios");
app.use(cors());
app.use(express.json());
const faqData = require ('./faqData.json');  // Import faqData.json



// ################################################################################################################ 


// middle wares (routes)



/*1*/app.post('/addCustomer', addCustomerHandler);                   // add customer to customers table on sign in 
/*2*/app.post('/ValidationLogIn/:role', handleValidationLogIn);      // validate customer or employee login
/*3*/app.post('/addCustomerTicket', addCustomerTicketHandler);       // add customer ticket to customerTickets table
/*4*/app.get('/getCustomerTickets/:CID', getCustomerTicketsHandler); // get customer tickets from customerTickets table
/*Insert number */app.get('/faq', faqHandler);                                    //Show FAQ info
/*insert number */app.get('/faq/search', searchFAQHandler);                       //Search in FAQ info


// ################################################################################################################


// *********************************************************************************************************************

// handlers ()


/*1*/function addCustomerHandler(req, res) {
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

// _____________________________________________________________________________________________________________________

/*2*/function handleValidationLogIn(req, res) {
    const roleNo = req.params.role;
    const getemail = req.body.email;
    const getpassword = req.body.password;
    if (roleNo == 1) {
        console.log("inside if 1 ")
        const sql = `SELECT * FROM customers WHERE email = $1 AND password = $2 `;
        const values = [getemail, getpassword];
        client
            .query(sql, values)
            .then((data) => {
                console.log(data.rows.length);
                if (data.rows.length > 0) {
                    res.send(data.rows);
                } else {
                    res.send("Invalid email or password");
                }
            })
            .catch((error) => {
                console.log(error);
                res.status(500).send("An error occurred while validating login");
            });
    }
    else if (roleNo == 2) {
        console.log("inside if 2 ")
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
// _____________________________________________________________________________________________________________________


/*3*/function addCustomerTicketHandler(req, res) {
    let newCustomerTicket = req.body;
    let sql = `INSERT INTO customerTickets (subject, description, status,customerId) VALUES ($1, $2, $3, $4) RETURNING *`;
    let values = [
        newCustomerTicket.subject,
        newCustomerTicket.description,
        "open",
        newCustomerTicket.customerId];
    client
        .query(sql, values)
        .then(result => {
            res.send(result.rows);
        })
        .catch(error => {
            console.log("error in adding customer ticket", error);
            res.status(500).send("An error occurred while adding customer ticket");
        });
}


// ______________________________________________________________________________________________________________________

/*4*/function getCustomerTicketsHandler(req, res) {
    let customerId = req.params.CID;
    let sql = `SELECT * FROM customerTickets WHERE customerId = $1`;
    let values = [customerId];
    client
        .query(sql, values)
        .then(result => {
            res.send(result.rows);
        })
        .catch(error => {
            console.log("error in getting customer tickets", error);
            res.status(500).send("An error occurred while getting customer tickets");
        });
}

// ______________________________________________________________________________________________________________________

/*5*/function getHandleUserInfo(req, res) {
  const sql = 'SELECT * FROM customers';
  client.query(sql)
    .then((data) => {
      const userInfo = data.rows.map((item) => ({
        customerId: item.customerid,
        name: item.name,
        email: item.email,
        address: item.address
      }));
      res.send(userInfo);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send("An error occurred while getting user info");
    });
}
// ______________________________________________________________________________________________________________________
// ______________________________________________________________________________________________________________________

/*6*/function faqHandler(req, res) {
  res.send(faqData);
}

  // ______________________________________________________________________________________________________________________
// ______________________________________________________________________________________________________________________

/*7*/function searchFAQHandler(req, res) {
    const searchTerm = req.query.term; // Assuming the search term is passed as a query parameter named 'term'
  
    if (!searchTerm) {
      res.status(400).send('Search term is missing');
      return;
    }
  
    const searchResults = faqData.filter((faq) => {
      const question = faq.question ? faq.question.toLowerCase() : '';
      return question.includes(searchTerm.toLowerCase());
    });
  
    if (searchResults.length === 0) {
      res.send('No results found, please choose a closer word');
    } else {
      res.send(searchResults);
    }
  }

//!! for example test >> http://localhost:5000/faq/search?term=update 
  // ______________________________________________________________________________________________________________________

// ###################################################################################################################

// listen to port if connected to database
client.connect().then(() => {
    const port = process.env.PORT;
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
    })
}).catch(() => { console.log(`error listening`) })