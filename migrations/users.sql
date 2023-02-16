
DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id      INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    
    name    VARCHAR(255) ,

    email   VARCHAR(255) UNIQUE,
    password VARCHAR(255),

    phone   INT UNIQUE,

    google VARCHAR(255) UNIQUE,

    facebook VARCHAR(255) UNIQUE
);
CREATE INDEX idx_email ON users(email);
CREATE INDEX idx_id ON users(id);
