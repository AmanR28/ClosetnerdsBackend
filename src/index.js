const express = require('express');
const app = express();
const session = require('express-session');
const MariaDBStore = require('express-mysql-session')(session);
const { profileRoute, authRoute } = require('./routes');
const { port, secretKey, db } = require('./config');

const  sessionStore = new MariaDBStore(db);

app.use(session({
  secret: secretKey,
  resave: false,
  saveUninitialized: true,
  cookie: {
      maxAge: 1000 * 60 * 60 * 24
  },
  store: sessionStore
}));

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.get('/', (req, res) => res.send('hi'));
app.use('/profile', profileRoute);
app.use('/auth', authRoute);

app.all('*', (req, res) => {
  res.status(404).send('Not Found!');
});

app.listen(port, () => {
  console.log('Server started on port', port);
});
