-- Create table Customers
DROP TABLE IF EXISTS customers;
CREATE TABLE IF NOT EXISTS customers
(
  customerId SERIAL PRIMARY KEY,
  name VARCHAR(255),
  email VARCHAR(255),
  address VARCHAR(255),
  password VARCHAR(255),
  roleId INTEGER REFERENCES roles(roleId)
);
-- Create table Roles
DROP TABLE IF EXISTS roles;
CREATE TABLE IF NOT EXISTS roles (
  roleId SERIAL PRIMARY KEY,
  roleName VARCHAR(255)
);
-- Create table Permissions
DROP TABLE IF EXISTS permissions;
CREATE TABLE IF NOT EXISTS permissions (
  permissionId SERIAL PRIMARY KEY,
  permission VARCHAR(255)
);
-- Create table RolePermissions
DROP TABLE IF EXISTS rolePermissions;
CREATE TABLE IF NOT EXISTS rolePermissions (
  roleId INTEGER REFERENCES roles(roleId),
  permissionId INTEGER REFERENCES permissions(permissionId),
  PRIMARY KEY (roleId, permissionId)
);
-- Create table CustomerTickets
DROP TABLE IF EXISTS customerTickets;
CREATE TABLE IF NOT EXISTS customerTickets (
  customerTicketId SERIAL PRIMARY KEY,
  subject VARCHAR(255),
  description TEXT,
  status VARCHAR(255) DEFAULT 'open',
  customerId INTEGER REFERENCES customers(customerId)
);
-- Create table AgentTickets
DROP TABLE IF EXISTS rolesKEY;
CREATE TABLE IF NOT EXISTS rolesKEY
(
  subject VARCHAR(255),
  agentDescription TEXT,
  priority VARCHAR(255),
  employeeComment TEXT,
  departmentId INTEGER REFERENCES departments(departmentId),
  customerTicketId INTEGER REFERENCES customerTickets(customerTicketId)
);
-- Create table Departments
DROP TABLE IF EXISTS departments;
CREATE TABLE IF NOT EXISTS departments (
  departmentId SERIAL PRIMARY KEY,
  departmentName VARCHAR(255)
);
-- Create table Employees
DROP TABLE IF EXISTS employees;
CREATE TABLE IF NOT EXISTS employees
 (
  employeeId SERIAL PRIMARY KEY,
  employeeName VARCHAR(255),
  departmentId INTEGER REFERENCES departments(departmentId),
  employeePassword VARCHAR(255),
  employeeEmail VARCHAR(255),
  roleId INTEGER REFERENCES roles(roleId)
);