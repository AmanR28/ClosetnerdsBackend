const express = require('express');
const cors = require('cors');
const app = express();
const profileRoute = require('./routes/profile.route');
const authRoute = require('./routes/auth.route');
const { port } = require('./config');
const passport = require('passport');
const { sequelize, User, Profile } = require('./db');
const hooks = require('./models/hooks');
const currentUser = require('./middleware/currentUser');

app.use(cors({ origin: '*' }));

sequelize
  .authenticate()
  .then(() => {
    console.log('Sequelize Connected.');
  })
  .catch(error => {
    console.error('Sequelize Failed: ', error);
  });

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(passport.initialize());
require('./services/passport.service');

app.use(currentUser);

app.get('/', (req, res) => res.send('hi'));
app.use('/profile', profileRoute);
app.use('/auth', authRoute);

app.all('*', (req, res) => {
  res.status(404).send('Not Found!');
});

app.listen(port, () => {
  console.log('Server started on port', port);
});
