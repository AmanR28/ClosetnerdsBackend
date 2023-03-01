DROP TABLE IF EXISTS profiles;

CREATE TABLE profiles (
    id      INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    
    email   VARCHAR(255) NOT NULL UNIQUE,
    name    VARCHAR(255) ,
    phone   VARCHAR(20),
    gender  ENUM('male', 'female'),

    isRegistered BOOLEAN DEFAULT FALSE,
    mailCount INT DEFAULT 0,

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
