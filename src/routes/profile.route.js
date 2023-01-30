const express = require('express');
const router = express.Router();
const db = require('../db');
const {profileQueries} = require('../queries')

router.get('/', (req, res) => {
    const sql = profileQueries.SHOW_PROFILE;
    db.query(sql, [req.body.email], (err, results) => {
      if(err) return res.status(500).send(err);
      res.send(JSON.stringify(results[0]));
    })
})

router.post('/', (req, res) => {
    const email = req.body.email || '';
    const name = req.body.name || '';
    const phone = req.body.phone || 0;
    const gender = req.body.gender || 'male';
    
    const sql = profileQueries.CREATE_PROFILE;
    const values = [email, name, phone, gender];

    db.query(sql, values, (error, results) => {
        if (error) {
            res.status(500).send('Error saving user information: ' + error);
        } else {
            res.status(200).send('User information saved successfully');
            console.log('done')
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

router.post('/occasion', (req, res) => {
    const occasion1 = req.body.occasion1;
    const occasion2 = req.body.occasion2;
    const occasion3 = req.body.occasion3;


    const sql = profileQueries.UPDATE_PROFILE_OCCASION;
    const values = [occasion1, occasion2, occasion3];

    db.query(sql, values, (error, results) => {
        if (error) {
            res.status(500).send('Error saving user information: ' + error);
        } else {
            res.send('Wears information saved successfully');
        }
    });
});


router.post('/prices', (req, res) => {
    const prices1 = req.body.prices1;
    const prices2 = req.body.prices2;
    const prices3 = req.body.prices3;


    const sql = profileQueries.UPDATE_PROFILE_PRICES;
    const values = [prices1, prices2, prices3];

    db.query(sql, values, (error, results) => {
        if (error) {
            res.status(500).send('Error saving user information: ' + error);
        } else {
            res.send('Wears information saved successfully');
        }
    });
});


router.post('/color', (req, res) => {
    const color1 = req.body.color1;
    const color2 = req.body.color2;
    const color3 = req.body.color3;


    const sql = profileQueries.UPDATE_PROFILE_COLORS;
    const values = [color1, color2, color3];

    db.query(sql, values, (error, results) => {
        if (error) {
            res.status(500).send('Error saving user information: ' + error);
        } else {
            res.send('Wears information saved successfully');
        }
    });
});



module.exports = router;
