create database e_turist_db;
use e_turist_db;

CREATE TABLE User (
    id int PRIMARY KEY AUTO_INCREMENT,
    password varchar(200) NOT NULL,
    fullName VARCHAR(200) NOT NULL,
    email varchar(200) NOT NULL UNIQUE,
    picturePath varchar(200) NULL,
    validationCode varchar(200) NULL,
    isValidated BOOLEAN DEFAULT false,
    modifiedAt timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    createdAt timestamp NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX (email)
);

CREATE TABLE Administrator (
    id int PRIMARY KEY AUTO_INCREMENT,
    password varchar(200) NOT NULL,
    email varchar(200) NOT NULL UNIQUE,
    picturePath varchar(200) NULL,
    validationCode varchar(200) NULL,
    isValidated BOOLEAN DEFAULT false,
    modifiedAt timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    createdAt timestamp NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX (email)
);

CREATE TABLE City (
    id int PRIMARY KEY AUTO_INCREMENT,
    name varchar(200) NOT NULL,
    identifier varchar(200) NOT NULL UNIQUE,
    modifiedAt timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    createdAt timestamp NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX (identifier)
);

CREATE TABLE Route (
    id int PRIMARY KEY AUTO_INCREMENT,
    name varchar(200) NOT NULL,
    description text NULL,
    picturePath varchar(200) NULL,
    cityId INT NOT NULL,
    modifiedAt timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    createdAt timestamp NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cityId) REFERENCES City(id)
);

CREATE TABLE Destination (
    id int PRIMARY KEY AUTO_INCREMENT,
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
    id int PRIMARY KEY AUTO_INCREMENT,
    userId INT NOT NULL,
    destinationId INT NOT NULL,
    modifiedAt timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    createdAt timestamp NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES User(id),
    FOREIGN KEY (destinationId) REFERENCES Destination(id)
);

CREATE TABLE Comment (
    id int PRIMARY KEY AUTO_INCREMENT,
    userId INT NOT NULL,
    routeId INT NOT NULL,
    comment TEXT NOT NULL,
    modifiedAt timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    createdAt timestamp NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (routeId) REFERENCES Route(id),
    FOREIGN KEY (userId) REFERENCES User(id)
);

CREATE TABLE AccessToken (
  id int PRIMARY KEY AUTO_INCREMENT,
  token varchar(200),
  userId int NULL,
  adminId int NULL,
  valid BOOLEAN DEFAULT true,
  modifiedAt timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  createdAt timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (adminId) REFERENCES Administrator(id),
  FOREIGN KEY (userId) REFERENCES User(id)
);

ALTER TABLE User CONVERT TO CHARACTER SET utf8 COLLATE utf8_unicode_ci;
ALTER TABLE AccessToken CONVERT TO CHARACTER SET utf8 COLLATE utf8_unicode_ci;
ALTER TABLE Administrator CONVERT TO CHARACTER SET utf8 COLLATE utf8_unicode_ci;
ALTER TABLE City CONVERT TO CHARACTER SET utf8 COLLATE utf8_unicode_ci;
ALTER TABLE Comment CONVERT TO CHARACTER SET utf8 COLLATE utf8_unicode_ci;
ALTER TABLE Destination CONVERT TO CHARACTER SET utf8 COLLATE utf8_unicode_ci;
ALTER TABLE Route CONVERT TO CHARACTER SET utf8 COLLATE utf8_unicode_ci;
ALTER TABLE UserDestination CONVERT TO CHARACTER SET utf8 COLLATE utf8_unicode_ci;

ALTER TABLE Administrator
  DROP COLUMN validationCode,
  DROP COLUMN isValidated,
  DROP COLUMN email,
  ADD COLUMN isDeleted BOOLEAN DEFAULT false,
  ADD COLUMN username VARCHAR(200) NOT NULL,
  ADD INDEX `username_index` (`username`);

insert into Administrator(username, password) 
values('admin', '98622de9302598f55fc201b15fa0f466d2a93608c9af2d8822449eeb460e80fa');

ALTER TABLE Route
ADD COLUMN isDeleted BOOLEAN DEFAULT false;
ALTER TABLE Destination
ADD COLUMN isDeleted BOOLEAN DEFAULT false;
ALTER TABLE City
ADD COLUMN isDeleted BOOLEAN DEFAULT false;
ALTER TABLE User
ADD COLUMN isDeleted BOOLEAN DEFAULT false;
ALTER TABLE Comment
ADD COLUMN isDeleted BOOLEAN DEFAULT false;


ALTER TABLE Comment
ADD COLUMN destinationId INT NULL,
ADD FOREIGN KEY (destinationId) REFERENCES Destination(id);

CREATE TABLE Rating (
    id int PRIMARY KEY AUTO_INCREMENT,
    userId INT NOT NULL,
    routeId INT NOT NULL,
    destinationId INT NULL,
    rating INT NOT NULL,
    modifiedAt timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    createdAt timestamp NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (routeId) REFERENCES Route(id),
    FOREIGN KEY (destinationId) REFERENCES Destination(id),
    FOREIGN KEY (userId) REFERENCES User(id)
);

ALTER TABLE Rating CONVERT TO CHARACTER SET utf8 COLLATE utf8_unicode_ci;