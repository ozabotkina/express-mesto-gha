const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const BadRequest = require('../errors/BadRequest');
const NotFoundError = require('../errors/NotFoundError');
const Error409 = require('../errors/Error409');

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(next);
};

module.exports.getUser = (req, res, next) => {
  User.findById(req.params.UserId)
    .then((user) => {
      if (!user) { throw new NotFoundError('Нет пользователя с таким id'); }
      res.send({ user });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports.createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      name: req.body.name,
      about: req.body.about,
      avatar: req.body.avatar,
      email: req.body.email,
      password: hash,
    }))
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => { if (err.code === 11000) { throw new Error409('Емейл уже зарегистрирован'); } })
    .catch((err) => next(err));
};

module.exports.currentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) { throw new NotFoundError('Нет пользователя с таким id'); }
      res.send({ user });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') { throw new BadRequest('Некорректный запрос'); }
      if (err.name === 'CastError') { throw new NotFoundError('Запрашиваемый пользователь не найден'); }
    })
    .catch(next);
};

module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') { throw new BadRequest('Некорректный запрос'); }
      if (err.name === 'CastError') { throw new NotFoundError('Запрашиваемый пользователь не найден'); }
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) { throw new NotFoundError('Неправильные почта или пароль'); }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) { throw new NotFoundError('Неправильные почта или пароль'); }
          return user;
        });
    })
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'something_4_mistery', { expiresIn: '7d' });
      res.send(token);
    })
    .catch(next);
};
