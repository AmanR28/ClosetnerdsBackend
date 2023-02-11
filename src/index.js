const express = require('express');
const app = express();
const profileRoute = require('./routes/profile.route');
const authRoute = require('./routes/auth.route');
const { port } = require('./config');
const passport = require('passport');

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(passport.initialize());
require('./services/passport.service');

app.get('/', (req, res) => res.send('hi'));
app.use('/profile', profileRoute);
app.use('/auth', authRoute);

app.all('*', (req, res) => {
  res.status(404).send('Not Found!');
});

app.listen(port, () => {
  console.log('Server started on port', port);
});
