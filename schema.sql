-- Create table Customers
CREATE TABLE customers (
  customerId SERIAL PRIMARY KEY,
  name VARCHAR(255),
  email VARCHAR(255),
  address VARCHAR(255),
  password VARCHAR(255),
  roleId INTEGER REFERENCES roles(roleId)
);

-- Create table Roles
CREATE TABLE roles (
  roleId SERIAL PRIMARY KEY,
  roleName VARCHAR(255)
);

-- Create table Permissions
CREATE TABLE permissions (
  permissionId SERIAL PRIMARY KEY,
  permission VARCHAR(255)
);

-- Create table RolePermissions
CREATE TABLE rolePermissions (
  roleId INTEGER REFERENCES roles(roleId),
  permissionId INTEGER REFERENCES permissions(permissionId),
  PRIMARY KEY (roleId, permissionId)
);

-- Create table CustomerTickets
CREATE TABLE customerTickets (
  customerTicketId SERIAL PRIMARY KEY,
  subject VARCHAR(255),
  description TEXT,
  status VARCHAR(255) DEFAULT 'open',
  customerId INTEGER REFERENCES customers(customerId)
);

-- Create table AgentTickets
CREATE TABLE agentTickets (
  agentTicketId SERIAL PRIMARY KEY,
  subject VARCHAR(255),
  agentDescription TEXT,
  priority VARCHAR(255),
  employeeComment TEXT,
  departmentId INTEGER REFERENCES departments(departmentId),
  customerTicketId INTEGER REFERENCES customerTickets(customerTicketId)
);

-- Create table Departments
CREATE TABLE departments (
  departmentId SERIAL PRIMARY KEY,
  departmentName VARCHAR(255)
);

-- Create table Employees
CREATE TABLE employees (
  employeeId SERIAL PRIMARY KEY,
  employeeName VARCHAR(255),
  departmentId INTEGER REFERENCES departments(departmentId),
  employeePassword VARCHAR(255),
  employeeEmail VARCHAR(255),
  roleId INTEGER REFERENCES roles(roleId)
);
