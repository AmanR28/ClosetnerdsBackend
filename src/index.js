const express = require('express');
const app = express();
const profile = require('./routes/profile.route');
const {port} = require('./config')

app.use(express.urlencoded({ extended: true }));

app.use('/profile', profile);

app.listen(port, () => {
    console.log('Server started on port', port);
});