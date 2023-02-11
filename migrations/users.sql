
DROP TABLE IF EXISTS users;

CREATE TABLE users (

    id      INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    
    email   VARCHAR(255) NOT NULL UNIQUE,
    name    VARCHAR(255) ,
    phone   INT,
    gender  ENUM('male', 'female'),

    isPasswordAuth BOOLEAN DEFAULT FALSE,
    password VARCHAR(255) NOT NULL,

    isGoogleAuth BOOLEAN DEFAULT FALSE
);
CREATE INDEX idx_email ON users(email);
CREATE INDEX idx_id ON users(id);
