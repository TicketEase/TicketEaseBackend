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
const faqData = require('./faqData.json');  // Import faqData.json


// ################################################################################################################ 
// middle wares (routes)

//FAQ
/*1*/app.get('/faq', faqHandler);                                    //Show FAQ info
/*2*/app.get('/searchFAQ/:serchingWord', searchFAQHandler);                       //Search in FAQ info
// _____________________________________________________________________________________________________________________

//Validation Login Handlers
/*3*/app.post('/costmerValidationLogIn', costmerValidationLogInHandle);      // validate customer login
/*4*/app.post('/employeeValidationLogIn/:roleNo', employeeValidationLogInHandle);      // validate employee login
// _____________________________________________________________________________________________________________________

//Customers side 
/*5*/app.post('/addCustomer', addCustomerHandler); // add customer to customers table on sign in 
/*6*/app.post('/addCustomerTicket/:CID', addCustomerTicketHandler); // add customer ticket to customerTickets table
/*7*/app.get('/getCustomerTickets/:CID', getCustomerTicketsHandler); // get customer tickets from customerTickets table
/*8*/app.get('/allCustomersTickets', allCustomersTicketsHandler); // get all customer tickets from customerTickets table were the status is open
/*9*/app.get('/getAllCustomers', getAllCustomersHandler);  //get all customers
/**/app.patch('/updateAgentStatus/:TID', updateAgentStatusHandler);
/**/app.patch('/closeCustomerTkt/:CID', closeCustomerTktHandler);
/*21 */app.get('/getcustomerbyemail', getcustomerbyemailHandler);//get customer by email    
// _____________________________________________________________________________________________________________________

//agent side
/*10*/app.post('/creatAgentTicket/:TID', CreatAgentTicketHandler);    //add agent ticket to AgentTicket table acoording to customer Ticket ID
/*11*/ app.get('/allAgentTickets', allAgentTicketsHandler); //get all agent tickets
/*12*/app.get('/SearchInAgentTicket/:cemail', SearchInAgentTicketHandler); //search in agent ticket based on customer's email
/*13*/app.patch('/CloseAgenttTicket/:TID', CloseAgentTicketHandler);//close AgentTicket 
/*14*/app.get('/sortAgTicketByStatus/:StsNo', sortingAgentTicketsByStatus);// sorte agent tickets according to status (closed or open)
/*15*/app.get('/sortAgTicketbyPriority/:PriNo', sortingAgentTicketsByPriority);// sorte agent tickets according to priority (high, medium, low)
/*16*/app.get('/sortAgTicketByDepartment/:DepNo', sortingAgentTicketsByDepartment);// sorte agent tickets according to Department 
// _____________________________________________________________________________________________________________________
//employee side 
/*17*/app.patch('/assignTicketByEmployee/:TID', assignTicketByEmployeeHandler);// Agent Ticket Assignment by employee 
/*18*/app.patch('/addCommentByEmployee/:TID', addCommentByEmployeeHandler); // Add comment on Agent Ticket by employee
/*19*/app.patch('/RemoveAgentTiketFromEmployeeWindow/:TID', RemoveAgentTiketFromEmployeeWindowHendler);// Remove Agent Tiket From Employee Window
/*20*/app.get('/allAgentTicketsOpen', allAgentTicketsOpenHandler);
/*21*/app.get('/allAssignTicketByEmployee', allAssignTicketByEmployeeHandler);
// *********************************************************************************************************************

// handlers ()

//FAQ Handlers
/*1*/function faqHandler(req, res) {
    res.send(faqData);
}

/*2*/function searchFAQHandler(req, res) {
    const searchTerm = req.params.serchingWord; // Assuming the search term is passed as a query parameter named 'term'

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
// _____________________________________________________________________________________________________________________

//Login Handlers

/*3*/function costmerValidationLogInHandle(req, res) {
    const getemail = req.body.cemail;
    const getpassword = req.body.cpassword;
    const sql = `SELECT * FROM customers WHERE cemail = $1 AND cpassword = $2 `;
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
/*4*/function employeeValidationLogInHandle(req, res) {
    const roleNo = req.params.roleNo;
    const getemail = req.body.employeeemail;
    const getpassword = req.body.employeepassword;
    if (roleNo == 2) {
        const sql = `SELECT * FROM employees WHERE employeeemail = $1 AND employeepassword = $2 `;
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

    else if (roleNo == 3) {
        const sql = `SELECT * FROM employees WHERE employeeemail = $1 AND employeepassword = $2`;
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
}

// _____________________________________________________________________________________________________________________
// CustomersHandler
/*5*/function addCustomerHandler(req, res) {
    let newCustomer = req.body;
    let sql = `INSERT INTO customers (cname, cemail, caddress, cpassword, roleid) VALUES ($1, $2, $3, $4, $5) RETURNING *`;
    let values = [newCustomer.cname, newCustomer.cemail, newCustomer.caddress, newCustomer.cpassword, 1];
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

/*6*/function addCustomerTicketHandler(req, res) {
    let CID = req.params.CID;
    let newCustomerTicket = req.body;
    let sql = `INSERT INTO customertickets (tktsubject, tktdescription, tktstatus,customerid) VALUES ($1, $2, $3, $4) RETURNING *`;
    let values = [
        newCustomerTicket.tktsubject,
        newCustomerTicket.tktdescription,
        "open",
        CID];
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

/*7*/function getCustomerTicketsHandler(req, res) {
    let customerId = req.params.CID;
    let sql = `SELECT * FROM customertickets WHERE customerid = $1`;
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

/*8*/function allCustomersTicketsHandler(req, res) {
    let sql = `SELECT * FROM customertickets WHERE tktstatus = 'open' AND tkttakenbyagent ='doing'`;
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

/*9*/function getAllCustomersHandler(req, res) {
    let sql = `SELECT * FROM customers`;
    client
        .query(sql)
        .then(result => {
            res.send(result.rows);
        })
        .catch(error => {
            console.log("error in getting agent tickets", error);
            res.status(500).send("An error occurred while getting agent tickets");
        });
}

function updateAgentStatusHandler(req, res) {
    let TID = req.params.TID;
    let sql = `UPDATE customertickets SET tkttakenbyagent=$1 WHERE customerticketid =${TID} RETURNING *`;
    let values = ['done'];
    client
        .query(sql, values)
        .then(result => {
            res.send(result.rows);
        })
        .catch(error => {
            console.log("error in creating agent ticket", error);
            res.status(500).send("An error occurred while closing agent ticket");
        });
}
/*13*/function closeCustomerTktHandler(req, res) {
    let CID = req.params.CID;
    let sql = `UPDATE customertickets SET tktstatus=$1 WHERE customerticketid =${CID} RETURNING *`;
    let values = ['closed'];
    client
        .query(sql, values)
        .then(result => {
            res.send(result.rows);
        })
        .catch(error => {
            console.log("error in creating agent ticket", error);
            res.status(500).send("An error occurred while closing agent ticket");
        });
}

/*21*/function getcustomerbyemailHandler(req, res) {
    let customeremail = req.query.email;
    let sql = `SELECT * FROM customers WHERE cemail = $1`;
    let values = [customeremail];
    client
        .query(sql, values)
        .then(result => {
            if (result.rows.length > 0) {
                res.send(result.rows);
            } else {
                res.send("Invalid email or password");
            }
        })
        .catch(error => {
            res.send("your not signed up please sign up");
        });
}
// _____________________________________________________________________________________________________________________
// agentHandler
/*10*/function CreatAgentTicketHandler(req, res) {
    let newAgentTicket = req.body;
    let TID = req.params.TID;
    let sql = `INSERT INTO agenttickets (agesubject, agentdescription, agepriority,departmentid,customerticketid,agestatus,employeeid) VALUES ($1, $2, $3, $4, $5,$6,$7) RETURNING *`;
    let values = [newAgentTicket.agesubject, newAgentTicket.agentdescription, newAgentTicket.agepriority, newAgentTicket.departmentid, TID, "open",7];
    client
        .query(sql, values)
        .then(result => {
            res.send(result.rows);
        })
        .catch(error => {
            console.log("error in creating agent ticket", error);
            res.status(500).send("An error occurred while creating agent ticket");
        });
}

/*11*/function allAgentTicketsHandler(req, res) {
    let sql = `SELECT * FROM agenttickets`;
    client
        .query(sql)
        .then(result => {
            res.send(result.rows);
        })
        .catch(error => {
            console.log("error in getting agent tickets", error);
            res.status(500).send("An error occurred while getting agent tickets");
        });
}


/*12*/function SearchInAgentTicketHandler(req, res) {
    let Cemial = req.params.cemail;
    console.log(Cemial);
    const sql = `
    SELECT agenttickets.agentticketid, agenttickets.agesubject, agenttickets.agentdescription, agenttickets.agepriority, agenttickets.employeecomment ,agenttickets.agestatus
    FROM agenttickets,customers,customertickets 
    WHERE customers.cemail=$1
    AND customers.customerid =customertickets.customerid
    AND agenttickets.customerticketid=customertickets.customerticketid;`
    let values = [Cemial];
    client.query(sql, values)
        .then((result) => {
            console.log("hi");
            res.send(result.rows)
        })
        .catch((error) => {
            res.status(500).send(error);
        });
}

/*13*/function CloseAgentTicketHandler(req, res) {
    let TID = req.params.TID;
    let sql = `UPDATE agenttickets SET agestatus=$1 WHERE agentticketid =${TID} RETURNING *`;
    let values = ['closed'];
    client
        .query(sql, values)
        .then(result => {
            res.send(result.rows);
        })
        .catch(error => {
            console.log("error in creating agent ticket", error);
            res.status(500).send("An error occurred while closing agent ticket");
        });
}

/*14*/function sortingAgentTicketsByStatus(req, res) {
    let status = req.params.StsNo; // Assuming status is provided as a query parameter
    if (status == 1) {
        let sql = `SELECT * FROM agenttickets WHERE agestatus = $1`;
        let values = ['open'];
        client
        .query(sql, values)
        .then(result => {
            res.send(result.rows);
        })
        .catch(error => {
            console.log("Error in sorting agent tickets by status:", error);
            res.status(500).send("An error occurred while sorting agent tickets by status");
        });
    }
    else if (status == 2) {
        let sql = `SELECT * FROM agenttickets WHERE agestatus = $1 `;
        let values = ['closed'];
        client
        .query(sql, values)
        .then(result => {
            res.send(result.rows);
        })
        .catch(error => {
            console.log("Error in sorting agent tickets by status:", error);
            res.status(500).send("An error occurred while sorting agent tickets by status");
        });
    }

  
}

/*15*/function sortingAgentTicketsByPriority(req, res) {
    let priority = req.params.PriNo; // Assuming priority is provided as a query parameter
    console.log(priority);
    if (priority == 1) {
        let sql = `SELECT * FROM agenttickets WHERE agepriority = $1;`
        let values = ['high'];
        client
        .query(sql, values)
        .then(result => {
            res.send(result.rows);
        })
        .catch(error => {
            console.log("Error in sorting agent tickets by priority:", error);
            res.status(500).send("An error occurred while sorting agent tickets by priority");
        });
    }
    else if (priority ==2) {
        let sql = `SELECT * FROM agenttickets WHERE agepriority = $1 ;`
        let values = ['medium'];
        client
        .query(sql, values)
        .then(result => {
            res.send(result.rows);
        })
        .catch(error => {
            console.log("Error in sorting agent tickets by priority:", error);
            res.status(500).send("An error occurred while sorting agent tickets by priority");
        });
    }
    else if (priority == 3) {
        let sql = `SELECT * FROM agenttickets WHERE agepriority = $1;`
        let values = ['low'];
        client
        .query(sql, values)
        .then(result => {
            res.send(result.rows);
        })
        .catch(error => {
            console.log("Error in sorting agent tickets by priority:", error);
            res.status(500).send("An error occurred while sorting agent tickets by priority");
        });
    }
    
 
}

/*16*/function sortingAgentTicketsByDepartment(req, res) {
    let departmentId = req.params.DepNo; // Assuming departmentId is provided as a query parameter
    // if (departmentId == 1) {
        let sql = `SELECT * FROM agenttickets WHERE departmentId = ${departmentId}`;
        // let values = ['1'];
        client
        .query(sql)
        .then(result => {
                res.send(result.rows);
        })
        .catch(error => {
            console.log("Error in sorting agent tickets by department ID:", error);
            res.status(500).send("An error occurred while sorting agent tickets by department ID");
        });

    // }
    // else if (departmentId == 2) {
    //     let sql = `SELECT * FROM agenttickets WHERE departmentId = $1`;
    //     let values = ['2'];
    //     client
    //     .query(sql, values)
    //     .then(result => {
            
    //             res.send(result.rows);
            
    //     })
    //     .catch(error => {
    //         console.log("Error in sorting agent tickets by department ID:", error);
    //         res.status(500).send("An error occurred while sorting agent tickets by department ID");
    //     });

    // } 
    // else if (departmentId == 3) {
    //     let sql = `SELECT * FROM agenttickets WHERE departmentId = $1`;
    //     let values = ['3'];
    //     client
    //     .query(sql, values)
    //     .then(result => {
    //         if (result.rows.length === 0) {
    //             res.send('No tickets available in this department');
    //         } else {
    //             res.send(result.rows);
    //         }
    //     })
    //     .catch(error => {
    //         console.log("Error in sorting agent tickets by department ID:", error);
    //         res.status(500).send("An error occurred while sorting agent tickets by department ID");
    //     });

    // }

}

// ______________________________________________________________________________________________________
//Empoloyee Side

/*17*/function assignTicketByEmployeeHandler(req, res) {

    let TID = req.params.TID;
    let employeeId = 8; // Replace this with the actual employee ID you want to assign

    let sql = `UPDATE agenttickets SET employeeid = $1 WHERE agentticketid = $2 RETURNING *`;

    client
        .query(sql, [employeeId, TID])
        .then(result => {
            res.send(result.rows);
        })
        .catch(error => {
            console.log("Error in assigning agent ticket to employee:", error);
            res.status(500).send("An error occurred while assigning agent ticket to employee");
        });
}

/*18*/function addCommentByEmployeeHandler(req, res) {

    let TID = req.params.TID;
    let comment = req.body.employeecomment;

    let sql = `UPDATE agenttickets SET employeecomment = $1 WHERE agentticketid = $2 RETURNING *;`

    client
        .query(sql, [comment, TID])
        .then(result => {
            res.send(result.rows);
        })
        .catch(error => {
            console.log("Error in adding comment to agent ticket:", error);
            res.status(500).send("An error occurred while adding comment to agent ticket by employee");
        });
}
/*19*/function RemoveAgentTiketFromEmployeeWindowHendler(req, res) {

    let TID = req.params.TID;
    let sql = `UPDATE agenttickets SET employeeid = $1 WHERE agentticketid =${TID} RETURNING *;`
    let values=[null];
    client
        .query(sql,values)
        .then(result => {
            res.send(result.rows);
        })
        .catch(error => {
            console.log("Error in adding comment to agent ticket:", error);
            res.status(500).send("An error occurred while adding comment to agent ticket by employee");
        });
}
// ______________________________________________________________________________________________________

/*20*/function allAgentTicketsOpenHandler(req, res) {
    let sql = `SELECT * FROM agenttickets WHERE agestatus = $1 AND employeeid = $2;`
    
    let values=['open',7];
    client
        .query(sql,values)
        .then(result => {
            res.send(result.rows);
        })
        .catch(error => {
            console.log("error in getting agent tickets", error);
            res.status(500).send("An error occurred while getting agent tickets");
        });
}

/*20*/function allAssignTicketByEmployeeHandler(req, res) {
    let sql = `SELECT * FROM agenttickets WHERE employeeid= 8`;
    client
        .query(sql)
        .then(result => {
            res.send(result.rows);
        })
        .catch(error => {
            console.log("error in getting agent tickets", error);
            res.status(500).send("An error occurred while getting agent tickets");
        });
}

// listen to port if connected to database
client.connect().then(() => {
    const port = process.env.PORT;
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
    })
}).catch(() => { console.log(`error listening`) })

