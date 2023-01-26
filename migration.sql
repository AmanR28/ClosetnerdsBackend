DROP TABLE IF EXISTS profiles;

CREATE TABLE profiles (
    id      INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    
    email   VARCHAR(255) NOT NULL UNIQUE,
    name    VARCHAR(255) ,
    phoneNo INT,
    gender  ENUM('male', 'female', '') DEFAULT ''
);