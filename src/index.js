const express = require('express');
const app = express();
const profileRoute = require('./routes/profile.route');
const authRoute = require('./routes/auth.route');
const { port } = require('./config');
const passport = require('passport');
const { sequelize, User, Profile } = require('./db2');
const hooks = require('./models/hooks');

const cors = require('cors');
app.use(cors({ origin: '*' }));

sequelize
  .authenticate()
  .then(() => {
    User.addHook('beforeCreate', hooks.User.beforeCreate);
    User.addHook('afterCreate', hooks.User.afterCreate);

    console.log('Sequelize Connected.');
  })
  .catch(error => {
    console.error('Sequelize Failed: ', error);
  });

sequelize
  .sync({ alter: true })
  .then(async () => {
    console.log('Sync Success!');
  })
  .catch(error => {
    console.error('Sync Failed ', error);
  });

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(passport.initialize());
require('./services/passport.service');

const getUser = require('./middleware/getUser');
app.get('/', getUser, (req, res) => res.send('hi'));
app.use('/profile', profileRoute);
app.use('/auth', authRoute);

app.all('*', (req, res) => {
  res.status(404).send('Not Found!');
});

app.listen(port, () => {
  console.log('Server started on port', port);
});
