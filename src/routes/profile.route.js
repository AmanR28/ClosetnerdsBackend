const express = require('express');
const router = express.Router();
const db = require('../db');
const {profileQueries} = require('../queries')

router.get('/', (req, res) => res.send('hi'))

router.post('/', (req, res) => {
    const email = req.body.email;
    const name = req.body.name;

    const sql = profileQueries.CREATE_PROFILE;
    const values = [email, name];

    db.query(sql, values, (error, results) => {
        if (error) {
            res.status(500).send('Error saving user information: ' + error);
        } else {
            res.send('User information saved successfully');
        }
    });
});

module.exports = router;
