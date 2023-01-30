const express = require('express');
const router = express.Router();
const db = require('../db');
const {profileQueries} = require('../queries')

router.get('/', async (req, res) => {
    if (!req.body.email) {
        return res.status(400).send('Bad Request')
    }
    try {
        const sql = profileQueries.SHOW_PROFILE;
        const results = await db.query(sql, req.body.email);
        res.status(200).json(results);
    } catch (error) {
        res.status(400).send(error.message)
    }
})

router.post('/', async (req, res) => {
    const email = req.body.email || '';
    const name = req.body.name || '';
    const phone = req.body.phone || 0;
    const gender = req.body.gender || 'male';

    const sql = profileQueries.CREATE_PROFILE;
    const values = [email, name, phone, gender];

    if (!email) {
        return res.status(400).send('Bad Request')
    }
    try {
        await db.query(sql, values);
        return res.status(200).send('Done');
    } catch (error) {
        console.error(error)
        res.status(500).send("Something Went Wrong")
    }
});

router.post('/measures', async(req, res) => {
    const email = req.body.email;
    const measures = {
        bust : req.body.bust || 0, 
        waist : req.body.waist || 0, 
        hip : req.body.hip || 0, 
        length : req.body.length || 0
    }

    if (!email) {
        return res.status(400).send('Bad Request')
    }
    const sql = profileQueries.UPDATE_PROFILE_MEASURE;
    const values = [measures, email];

    try {
        await db.query(sql, values);
        return res.status(200).send('Done');
    } catch (error) {
        res.status(400).send(error.message)
    }
});

router.post('/wears', async(req, res) => {
    const email = req.body.email;
    const wears = req.body.wears || {};
    const subs = req.body.subs || {};

    
    const sql = profileQueries.UPDATE_PROFILE_WEARS;
    const values = [wears, subs, email];

    if (!email) {
        return res.status(400).send('Bad Request')
    }
    try {
        await db.query(sql, values);
        return res.status(200).send('Done');
    } catch (error) {
        console.error(error)
        res.status(500).send("Something Went Wrong")
    }
});

router.post('/occasions', async (req, res) => {
    const email = req.body.email;
    const occasions = req.body.occasions || {};

    const sql = profileQueries.UPDATE_PROFILE_OCCASIONS;
    const values = [occasions, email];

    if (!email) {
        return res.status(400).send('Bad Request')
    }
    try {
        await db.query(sql, values);
        return res.status(200).send('Done');
    } catch (error) {
        console.error(error)
        res.status(500).send("Something Went Wrong")
    }
});


router.post('/prices', async (req, res) => {
    const email = req.body.email;
    const prices = req.body.prices || {};

    const sql = profileQueries.UPDATE_PROFILE_PRICES;
    const values = [prices, email];

    if (!email) {
        return res.status(400).send('Bad Request')
    }
    try {
        await db.query(sql, values);
        return res.status(200).send('Done');
    } catch (error) {
        console.error(error)
        res.status(500).send("Something Went Wrong")
    }
});

router.post('/colors', async (req, res) => {
    const email = req.body.email;
    const colors = req.body.colors || {}; 

    const sql = profileQueries.UPDATE_PROFILE_COLORS;
    const values = [colors, email];

    if (!email) {
        return res.status(400).send('Bad Request')
    }
    try {
        await db.query(sql, values);
        return res.status(200).send('Done');
    } catch (error) {
        console.error(error)
        res.status(500).send("Something Went Wrong")
    }
});


router.post('/type', async (req, res) => {
    const email = req.body.email;
    const type = req.body.type || ''; 

    const sql = profileQueries.UPDATE_PROFILE_TYPE;
    const values = [type, email];

    if (!email) {
        return res.status(400).send('Bad Request')
    }
    try {
        await db.query(sql, values);
        return res.status(200).send('Done');
    } catch (error) {
        console.error(error)
        res.status(500).send("Something Went Wrong")
    }
});

router.post('/brands', async (req, res) => {
    const email = req.body.email;
    const brands = req.body.brands || ''; 

    const sql = profileQueries.UPDATE_PROFILE_BRANDS;
    const values = [brands, email];

    if (!email) {
        return res.status(400).send('Bad Request')
    }
    try {
        await db.query(sql, values);
        return res.status(200).send('Done');
    } catch (error) {
        console.error(error)
        res.status(500).send("Something Went Wrong")
    }
});

router.post('/celebrity', async (req, res) => {
    const email = req.body.email;
    const celebrity = req.body.celebrity || ''; 

    const sql = profileQueries.UPDATE_PROFILE_CELEBRITY;
    const values = [celebrity, email];

    if (!email) {
        return res.status(400).send('Bad Request')
    }
    try {
        await db.query(sql, values);
        return res.status(200).send('Done');
    } catch (error) {
        console.error(error)
        res.status(500).send("Something Went Wrong")
    }
});

router.post('/skin', async (req, res) => {
    const email = req.body.email;
    const skin = req.body.skin|| ''; 

    const sql = profileQueries.UPDATE_PROFILE_SKIN;
    const values = [skin, email];

    if (!email) {
        return res.status(400).send('Bad Request')
    }
    try {
        await db.query(sql, values);
        return res.status(200).send('Done');
    } catch (error) {
        console.error(error)
        res.status(500).send("Something Went Wrong")
    }
});

router.post('/picture', async (req, res) => {
    const email = req.body.email;
    const picture = req.body.picture || ''; 

    const sql = profileQueries.UPDATE_PROFILE_PICTURE;
    const values = [picture, email];

    if (!email) {
        return res.status(400).send('Bad Request')
    }
    try {
        await db.query(sql, values);
        return res.status(200).send('Done');
    } catch (error) {
        console.error(error)
        res.status(500).send("Something Went Wrong")
    }
});


module.exports = router;
