# TicketEaseBackend
<!-- /*5*/
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
 -->

<!-- // _____________________________________________________________________________________________________________________ -->
<!-- /* 
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

// ______________________________________________________________________________________________________________________ -->

<!-- // http://localhost:3001/getCustomerTickets/1 -->
<!-- /* 
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


// ________________________________________________________________________________________________________________________ -->
<!-- /*
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

    // ______________________________________________________________________________________________________________________


    //!! for example test >> http://localhost:5000/searchFAQ?term=update 


    // ______________________________________________________________________________________________________________________ -->
