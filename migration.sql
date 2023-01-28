DROP TABLE IF EXISTS profiles;

CREATE TABLE profiles (
    id      INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    
    email   VARCHAR(255) NOT NULL UNIQUE,
    name    VARCHAR(255) ,
    phoneNo INT,
    gender  ENUM('male', 'female', '') DEFAULT '',

    bust INT,
    waist INT,
    hip INT,
    length INT,

    wear JSON,
    sub JSON,

    occasion1 TEXT,
    occasion2 TEXT,
    occasion3 TEXT,

    price1 TEXT,
    price2 TEXT,
    price3 TEXT,

    color1 TEXT,
    color2 TEXT,
    color3 TEXT,

    type TEXT,

    brands TEXT,

    celebrity TEXT,

    skin TEXT,

    picture TEXT
);

CREATE INDEX idx_email ON profiles(email);