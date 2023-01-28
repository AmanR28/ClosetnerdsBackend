const express = require('express');
const router = express.Router();
const db = require('../db');
const {profileQueries} = require('../queries')

router.post('/', (req, res) => {
    const email = req.body.email;
    const name = req.body.name;
    const phoneNo = req.body.phoneNo;
    const gender = req.body.gender;

    const sql = profileQueries.CREATE_PROFILE;
    const values = [email, name, phoneNo, gender];

    db.query(sql, values, (error, results) => {
        if (error) {
            res.status(500).send('Error saving user information: ' + error);
        } else {
            res.send('User information saved successfully');
        }
    });
});

router.post('/measures', (req, res) => {
    const email = req.body.email;
    const bust = req.body.bust || 0;
    const waist = req.body.waist || 0;
    const hip = req.body.hip || 0;
    const length = req.body.length || 0;

    const sql = profileQueries.UPDATE_PROFILE_MEASURE;
    const values = [bust, waist, hip, length, email];

    db.query(sql, values, (error, results) => {
        if (error) {
            res.status(500).send('Error saving user information: ' + error);
        } else {
            res.send('Measures information saved successfully');
        }
    });
});

router.post('/wears', (req, res) => {
    const email = req.body.email;
    const wear = req.body.wear;
    const sub = req.body.sub;


    const sql = profileQueries.UPDATE_PROFILE_WEARS;
    const values = [wear, sub,email];

    db.query(sql, values, (error, results) => {
        if (error) {
            res.status(500).send('Error saving user information: ' + error);
        } else {
            res.send('Wears information saved successfully');
        }
    });
});


module.exports = router;
