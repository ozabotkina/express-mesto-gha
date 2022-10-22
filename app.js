const express = require('express');
const bodyParser = require('body-parser');

const mongoose = require('mongoose');

const routerUsers = require('./routes/users');
const routerCards = require('./routes/cards');
const { NotFoundError } = require('./utils/errors');

const { PORT = 3000 } = process.env;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb', {
});

app.use((req, res, next) => {
  req.user = { _id: '634ef432d5465fd422b8f1bb' };
  next();
});

app.use('/users', routerUsers);
app.use('/cards', routerCards);
app.use('/*', (req, res) => {
  res.status(NotFoundError).send({ message: 'Неправильный путь' });
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(PORT);
});
