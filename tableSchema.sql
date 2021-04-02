create database e_turist_db;
use e_turist_db;

CREATE TABLE User (
    id int NOT NULL PRIMARY KEY,
    username varchar(200) NOT NULL,
    password varchar(200) NOT NULL,
    email varchar(200) NOT NULL UNIQUE,
    picturePath varchar(200) NULL,
    modifiedAt timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    createdAt timestamp NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX (email)
);

CREATE TABLE Administrator (
    id int NOT NULL PRIMARY KEY,
    username varchar(200) NOT NULL,
    password varchar(200) NOT NULL,
    email varchar(200) NOT NULL UNIQUE,
    picturePath varchar(200) NULL,
    modifiedAt timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    createdAt timestamp NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX (email)
);

CREATE TABLE City (
    id int NOT NULL PRIMARY KEY,
    name varchar(200) NOT NULL,
    identifier varchar(200) NOT NULL UNIQUE,
    modifiedAt timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    createdAt timestamp NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX (identifier)
);

CREATE TABLE Route (
    id int NOT NULL PRIMARY KEY,
    name varchar(200) NOT NULL,
    description text NULL,
    picturePath varchar(200) NULL,
    cityId INT NOT NULL,
    modifiedAt timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    createdAt timestamp NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cityId) REFERENCES City(id)
);

CREATE TABLE Destination (
    id int NOT NULL PRIMARY KEY,
    name varchar(200) NOT NULL,
    description text NULL,
    picturePath varchar(200) NULL,
    routeId INT NOT NULL,
    modifiedAt timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    createdAt timestamp NULL DEFAULT CURRENT_TIMESTAMP,
    coordinates POINT,
    FOREIGN KEY (routeId) REFERENCES Route(id)
);

CREATE TABLE UserDestination (
    id int NOT NULL PRIMARY KEY,
    userId INT NOT NULL,
    destinationId INT NOT NULL,
    modifiedAt timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    createdAt timestamp NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES User(id),
    FOREIGN KEY (destinationId) REFERENCES Destination(id)
);

CREATE TABLE Comment (
    id int NOT NULL PRIMARY KEY,
    userId INT NOT NULL,
    routeId INT NOT NULL,
    modifiedAt timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    createdAt timestamp NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (routeId) REFERENCES Route(id),
    FOREIGN KEY (userId) REFERENCES User(id)
);

CREATE TABLE AccessToken (
  id int NOT NULL PRIMARY KEY,
  token varchar(200),
  userId int NULL,
  adminId int NULL,
  valid BOOLEAN DEFAULT true,
  modifiedAt timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  createdAt timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (adminId) REFERENCES Administrator(id),
  FOREIGN KEY (userId) REFERENCES User(id)
);
