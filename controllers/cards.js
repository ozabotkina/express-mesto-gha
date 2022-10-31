const Card = require('../models/card');
const BadRequest = require('../errors/BadRequest');
const NotFoundError = require('../errors/NotFoundError');
const Error403 = require('../errors/Error403');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send({ cards }))
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  Card.deleteOne({ _id: req.params.cardId, owner: req.user._id._id })
    .then(({ deletedCount }) => {
      if (deletedCount === 0) { throw new Error403('Среди созданных вами карточек такой нет'); }
      if (deletedCount === 1) { res.send({ message: 'Карточка удалена' }); }
    })
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      res.send({ card });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') { throw new BadRequest('Некорректный запрос'); }
    })
    .catch(next);
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true, runValidators: true },
  )
    .then((card) => {
      if (!card) { throw new NotFoundError('Запрашиваемая карточка не найдена'); }
      res.send({ card });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') { throw new BadRequest('Некорректный запрос'); }
      if (err.name === 'CastError') { throw new NotFoundError('Запрашиваемая карточка не найдена'); }
    })
    .catch(next);
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id._id } },
    { new: true, runValidators: true },

  )
    .then((card) => {
      if (!card) { throw new NotFoundError('Запрашиваемая карточка не найдена'); }
      res.send({ card });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') { throw new BadRequest('Некорректный запрос'); }
      if (err.name === 'CastError') { throw new NotFoundError('nЗапрашиваемая карточка не найдена'); }
    })
    .catch(next);
};
