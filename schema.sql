-- Create table Customers
DROP TABLE IF EXISTS customers;
CREATE TABLE IF NOT EXISTS customers
(
  customerid SERIAL PRIMARY KEY,
  cname VARCHAR(255),
  cemail VARCHAR(255),
  caddress VARCHAR(255),
  cpassword VARCHAR(255),
  roleid INTEGER REFERENCES roles(roleid)
);
-- Create table Roles
DROP TABLE IF EXISTS roles;
CREATE TABLE IF NOT EXISTS roles (
  roleid SERIAL PRIMARY KEY,
  rolename VARCHAR(255)
);
-- Create table Permissions
DROP TABLE IF EXISTS permissions;
CREATE TABLE IF NOT EXISTS permissions (
  permissionid SERIAL PRIMARY KEY,
  permission VARCHAR(255)
);
-- Create table RolePermissions
DROP TABLE IF EXISTS rolepermissions;
CREATE TABLE IF NOT EXISTS rolepermissions (
  roleid INTEGER REFERENCES roles(roleid),
  permissionid INTEGER REFERENCES permissions(permissionid),
  PRIMARY KEY (roleid, permissionid)
);
-- Create table CustomerTickets
DROP TABLE IF EXISTS customertickets;
CREATE TABLE IF NOT EXISTS customertickets (
  customerticketid SERIAL PRIMARY KEY,
  tktsubject VARCHAR(255),
  tktdescription TEXT,
  tktstatus VARCHAR(255) DEFAULT 'open',
  customerid INTEGER REFERENCES customers(customerid)
);
-- Create table AgentTickets
DROP TABLE IF EXISTS agenttickets;
CREATE TABLE IF NOT EXISTS agenttickets
(
  agentticketid SERIAL PRIMARY KEY,
  agesubject VARCHAR(255),
  agentdescription TEXT,
  agepriority VARCHAR(255),
  employeecomment TEXT,
  departmentid INTEGER REFERENCES departments(departmentid),
  customerticketid INTEGER REFERENCES customertickets(customerticketid),
  employeeid INTEGER REFERENCES Employees(employeeid),
  agestatus VARCHAR(255)
);

-- Create table Departments
DROP TABLE IF EXISTS departments;
CREATE TABLE IF NOT EXISTS departments (
  departmentid SERIAL PRIMARY KEY,
  departmentname VARCHAR(255)
);

-- Create table Employees
DROP TABLE IF EXISTS employees;
CREATE TABLE IF NOT EXISTS employees
 (
  employeeid SERIAL PRIMARY KEY,
  employeename VARCHAR(255),
  departmentid INTEGER REFERENCES departments(departmentid),
  employeepassword VARCHAR(255),
  employeeemail VARCHAR(255),
  roleid INTEGER REFERENCES roles(roleid)
);