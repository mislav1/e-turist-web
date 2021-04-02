CREATE TABLE User (
    id int NOT NULL PRIMARY KEY IDENTITY,
    username varchar(200) NOT NULL,
    password varchar(200) NOT NULL,
    email varchar(200) NOT NULL UNIQUE,
    picturePath varchar(200) NULL,
    modifiedAt timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    createdAt timestamp NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX (email)
);

CREATE TABLE Administrator (
    id int NOT NULL PRIMARY KEY IDENTITY,
    username varchar(200) NOT NULL,
    password varchar(200) NOT NULL,
    email varchar(200) NOT NULL UNIQUE,
    picturePath varchar(200) NULL,
    modifiedAt timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    createdAt timestamp NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX (email)
);

CREATE TABLE City (
    id int NOT NULL PRIMARY KEY IDENTITY,
    name varchar(200) NOT NULL,
    identifier varchar(200) NOT NULL UNIQUE,
    modifiedAt timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    createdAt timestamp NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX (identifier)
);

CREATE TABLE Route (
    id int NOT NULL PRIMARY KEY IDENTITY,
    name varchar(200) NOT NULL,
    description text NULL,
    picturePath varchar(200) NULL,
    cityId INT NOT NULL FOREIGN KEY REFERENCES City(id),
    modifiedAt timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    createdAt timestamp NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX (cityId)
);

CREATE TABLE Destination (
    id int NOT NULL PRIMARY KEY IDENTITY,
    name varchar(200) NOT NULL,
    description text NULL,
    picturePath varchar(200) NULL,
    routeId INT NOT NULL FOREIGN KEY REFERENCES Route(id),
    modifiedAt timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    createdAt timestamp NULL DEFAULT CURRENT_TIMESTAMP,
    coordinates POINT,
    INDEX (routeId)
);

CREATE TABLE UserDestination (
    id int NOT NULL PRIMARY KEY IDENTITY,
    userId INT NOT NULL FOREIGN KEY REFERENCES User(id),
    destinationId INT NOT NULL FOREIGN KEY REFERENCES Destination(id),
    modifiedAt timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    createdAt timestamp NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX (userId)
);

CREATE TABLE Comment (
    id int NOT NULL PRIMARY KEY IDENTITY,
    userId INT NOT NULL FOREIGN KEY REFERENCES User(id),
    routeId INT NOT NULL FOREIGN KEY REFERENCES Route(id),
    modifiedAt timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    createdAt timestamp NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX (routeId)
);

CREATE TABLE AccessToken (
  id int NOT NULL PRIMARY KEY IDENTITY,
  token varchar(200),
  userId int NULL,
  adminId int NULL,
  valid BOOLEAN DEFAULT true,
  modifiedAt timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  createdAt timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX(userId),
  INDEX(adminId)
);
