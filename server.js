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


// ################################################################################################################ 


// middle wares (routes)



/*1*/app.post('/addCustomer', addCustomerHandler);                   // add customer to customers table on sign in 
/*2*/app.post('/ValidationLogIn/:role', handleValidationLogIn);      // validate customer or employee login
/*3*/app.post('/addCustomerTicket', addCustomerTicketHandler);       // add customer ticket to customerTickets table
/*4*/app.get('/getCustomerTickets/:CID', getCustomerTicketsHandler); // get customer tickets from customerTickets table
/*5*/app.put('/updateCustomerTicket/:TID', updateCustomerTicketHandler); // update customer ticket in customerTickets table
/*6*/app.put('/updateTicketStatus/:TID', updateTicketStatusHandler); // update ticket status in customerTickets table
// here we can add more middle wares (routes) to handle requests
/*7*/app.put('/updateAgentTickets/:agentTID', updateAgentTicketHandler);   // add the employee comment to the agent ticket
/*8*/app.get('/allCustomersTickets', allCustomersTicketsHandler); // get all customer tickets from customerTickets table were the status is open

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
/*
 http://localhost:3001/addCustomer

 req.body
{
  "name":"mohammad",
  "email":"momo@gmail.com",
  "address":"irbid",
  "password":"0000"
}
// res.body
[
    {
      "customerid": 5,
      "name": "mohammad",
      "email": "momo@gmail.com",
      "address": "irbid",
      "password": "0000",
      "roleid": 1
    }
  ]
 */


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
/* 
 http://localhost:3001/addCustomerTicket

 req.body
{
  "subject":"mohammafsfsfsfd",
  "description":"momo@ddfesfsfsefsfsgmail.com",
  "status":"open",
  "customerId":"1"
}
res.body
[
  {
    "customerticketid": 15,
    "subject": "mohammafsfsfsfd",
    "description": "momo@ddfesfsfsefsfsgmail.com",
    "status": "open",
    "customerid": 1
  }
]
*/

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


// http://localhost:3001/getCustomerTickets/1



// ______________________________________________________________________________________________________________________




/*5*/ function updateCustomerTicketHandler(req, res) {
    let ticketId = req.params.TID;
    let customerUpdate = req.body;
    let sql = `UPDATE customerTickets
    SET subject = $1, description = $2
    WHERE customerTicketId = $3
    RETURNING *`;
    let values = [customerUpdate.subject, customerUpdate.description, ticketId];
    client
        .query(sql, values)
        .then(result => {
            res.send(result.rows);
        })
        .catch(error => {
            console.log("Error in updating customer ticket:", error);
            res.status(500).send("An error occurred while updating customer ticket");
        });
}
/* 
http://localhost:3001/updateCustomerTicket/15

req.body
{
  "subject":"noooooooooooooooooooo",
  "description":"momo@ddfesfsfsdadawdawdawdefsfsgmail.com"
}

res.body
[
  {
    "customerticketid": 15,
    "subject": "noooooooooooooooooooo",
    "description": "momo@ddfesfsfsdadawdawdawdefsfsgmail.com",
    "status": "open",
    "customerid": 1
  }
]
*/


// ________________________________________________________________________________________________________________________



/*6*/function updateTicketStatusHandler(req, res) {
    let ticketId = req.params.TID;
    let customerUpdate = req.body.status;
    let sql = `UPDATE customerTickets
    SET status = $1
    WHERE customerTicketId = $2
    RETURNING *`;
    let values = [customerUpdate, ticketId];
    client
        .query(sql, values)
        .then(result => {
            res.send(result.rows);
        })
        .catch(error => {
            console.log("Error in updating customer ticket:", error);
            res.status(500).send("An error occurred while updating customer ticket");
        });
}


/* 
http://localhost:3001/updateTicketStatus/15

req.body
{
    "status": "inprogress"
}

res.body

[
  {
    "customerticketid": 15,
    "subject": "noooooooooooooooooooo",
    "description": "momo@ddfesfsfsdadawdawdawdefsfsgmail.com",
    "status": "inprogress",
    "customerid": 1
  }
]

*/

// ______________________________________________________________________________________________________________________



/*7*/function updateAgentTicketHandler(req, res) {
    let agentTicketId = req.params.agentTID;
    let employeeComment = req.body.comment;
    let sql = `UPDATE AgentTickets
    SET employeeComment = $1
    WHERE agentticketid = $2
    RETURNING *`;
    let values = [employeeComment, agentTicketId];
    client
        .query(sql, values)
        .then(result => {
            res.send(result.rows);
        })
        .catch(error => {
            console.log("Error in updating agent ticket:", error);
            res.status(500).send("An error occurred while updating agent ticket");
        });
}

/*
http://localhost:3001/updateAgentTickets/1

req.body

{
    "comment": " we will not fix the issue and take all your money"
}

res.body
[
  {
    "agentticketid": 1,
    "subject": "aaaaaa",
    "agentdescription": "bbbbbb",
    "priority": "cccccc",
    "employeecomment": " we will not fix the issue and take all your money",
    "departmentid": 1,
    "customerticketid": 1
  }
]

*/

// ______________________________________________________________________________________________________________________

/*7*/function allCustomersTicketsHandler(req, res) {
    let sql = `SELECT * FROM customerTickets WHERE status = 'open'`;
    client
        .query(sql)
        .then(result => {
            res.send(result.rows);
        })
        .catch(error => {
            console.log("error in getting customer tickets", error);
            res.status(500).send("An error occurred while getting customer tickets");
        });
}

/*
http://localhost:3001/allCustomersTickets

res.body

[
  {
    "customerticketid": 2,
    "subject": "spoder",
    "description": "i need spooder man ",
    "status": "open",
    "customerid": 1
  },
   {
    "customerticketid": 8,
    "subject": "jamal",
    "description": "rabit head ",
    "status": "open",
    "customerid": 2
  }
]
*/



// ###################################################################################################################

// listen to port if connected to database
client.connect().then(() => {
    const port = process.env.PORT;
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
    })
}).catch(() => { console.log(`error listening`) })