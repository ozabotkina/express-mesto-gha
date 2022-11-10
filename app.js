const express = require('express');
const bodyParser = require('body-parser');
const { celebrate, Joi, errors } = require('celebrate');

const mongoose = require('mongoose');
const routerUsers = require('./routes/users');
const routerCards = require('./routes/cards');
const NotFoundError = require('./errors/NotFoundError');
const { login, createUser } = require('./controllers/users');
const tokenAuth = require('./middlewares/auth');
const regex = require('./utils/const');

const { PORT = 3000 } = process.env;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb', {
});

app.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),
  login,
);

app.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
      // eslint-disable-next-line no-useless-escape
      avatar: Joi.string().uri().pattern(regex),
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),
  createUser,
);

app.use('/users', tokenAuth, routerUsers);
app.use('/cards', tokenAuth, routerCards);

app.use('/*', () => {
  throw new NotFoundError('Неправильный путь');
});

app.use(errors());
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
    // проверяем статус и выставляем сообщение в зависимости от него
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
  // res.send({ message: err.message });
  next();
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(PORT);
});
