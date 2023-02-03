const express = require('express');
const app = express();
const { profile, user } = require('./routes');
const { port } = require('./config');

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  }),
);

app.get('/', (req, res) => res.send('hi'));
app.use('/profile', profile);
app.use('/user', user);

app.all('*', (req, res) => {
  res.status(404).send('Not Found!');
});

app.listen(port, () => {
  console.log('Server started on port', port);
});
