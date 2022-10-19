const User = require('../models/user');
const { NotFoundError, GeneralError, BadRequest} = require('../utils/errors.js');


module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(GeneralError).send({ message: 'Произошла ошибка' }));
};

module.exports.getUser = (req, res) => {
  User.findById(req.params.UserId)
    .then((user) => {
      res.send({ user });
    })
    .catch((err) => {
      if (err.name === 'CastError') { res.status(NotFoundError).send({ message: 'Запрашиваемый пользователь не найден' }); return; }
      res.status(GeneralError).send({ message: 'Произошла ошибка' });
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') { res.status(BadRequest).send({ message: 'Некорректный запрос' }); return; }
      res.status(GeneralError).send({ message: 'Произошла ошибка' });
    });
};

module.exports.updateUser = (req, res) => {

  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true },
  )
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') { res.status(NotFoundError).send({ message: 'Запрашиваемый пользователь не найден' }); return; }
      if (err.name === 'ValidationError') { res.status(BadRequest).send({ message: 'Некорректный запрос' }); return; }
      res.status(GeneralError).send({ message: 'Произошла ошибка' });
    });
};


module.exports.updateAvatar = (req, res) => {

  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true },
  )
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') { res.status(NotFoundError).send({ message: 'Запрашиваемый пользователь не найден' }); return; }
      if (err.name === 'ValidationError') { res.status(BadRequest).send({ message: 'Некорректный запрос' }); return; }
      res.status(GeneralError).send({ message: 'Произошла ошибка' });
    });
};
