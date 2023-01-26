# Closet Nerds API


**Table of Contents**

- [Features](#Features)
- [Endpoints](#Endpoints)
- [Setup and run](#Setup-and-run)
  - [Run app in Linux](#Run-app-in-Linux)


## Features

- Profile

## Endpoints

1. `Post /profile` : Setup Profile
```
{
    "email": <email_id>,
    "name": <name>,
    "phone": <phone>,
    "gender": <male|female|null>
}
```


## Setup and run

### Run app in Linux

The project runs on Python 3.

1. Install Project Dependencies:
```
npm run install
```

2. Setup MySql Database:
```
mysql -u $USER -p $DB_NAME < migration.sql 
```

3. Setup ENV Variable at `.env` file, using `.env.example`.
```
cp .env.example .env
```
Fill variables.

4. Run App.
   For Production
```
npm run start
```

    For Development
```
npm run start:dev
```

### Thank You
