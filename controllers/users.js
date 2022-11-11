const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const BadRequest = require('../errors/BadRequest');
const NotFoundError = require('../errors/NotFoundError');
const Error409 = require('../errors/Error409');
const Error401 = require('../errors/Error401');

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(next);
};

module.exports.getUser = (req, res, next) => {
  User.findById(req.params.UserId)
    .then((user) => {
      if (!user) { throw new NotFoundError(' Нет пользователя с таким id'); }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') { return next(new BadRequest('Некорректный userID')); }
      return next(err);
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
    .then(({
      name, about, avatar, email,
    }) => {
      res.status(200).send({
        name, about, avatar, email,
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') { return next(new BadRequest('Некорректный запрос')); }
      if (err.code === 11000) { return next(new Error409('Емейл уже зарегистрирован')); }
      return next(err);
    });
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
      if (err.name === 'ValidationError') { return next(new BadRequest('Некорректный запрос')); }
      if (err.name === 'CastError') { return next(new BadRequest('Запрашиваемый пользователь не найден')); }
      return next(err);
    });
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
      if (err.name === 'ValidationError') { return next(new BadRequest('Некорректный запрос')); }
      if (err.name === 'CastError') { return next(new BadRequest('Запрашиваемый пользователь не найден')); }
      return next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) { throw new Error401('Неправильные почта или пароль'); }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) { throw new Error401('Неправильные почта или пароль'); }
          return user;
        });
    })
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'something_4_mistery', { expiresIn: '7d' });
      res.send({ token });
    })
    .catch(next);
};
