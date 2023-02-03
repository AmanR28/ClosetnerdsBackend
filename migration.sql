DROP TABLE IF EXISTS profiles;

CREATE TABLE profiles (
    id      INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    
    email   VARCHAR(255) NOT NULL UNIQUE,
    name    VARCHAR(255) ,
    phone   INT,
    gender  ENUM('male', 'female'),

    measures JSON,
    wears JSON,
    subs JSON,
    occasions JSON,
    prices JSON,
    colors JSON,

    type ENUM('Triangle','Inverted','Hourglass','Rectangle'),
    
    brands TEXT,
    celebrity TEXT,
    skin TEXT,
    picture TEXT
);

CREATE INDEX idx_email ON profiles(email);