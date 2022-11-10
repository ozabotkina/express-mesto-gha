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
  Card.findById({ _id: req.params.cardId })
    .then((card) => {
      if (!card) { throw new NotFoundError('Такой карточки нет'); }
      if (card.owner._id.toString() !== req.user._id._id) { throw new Error403('Карточка другого юзера'); }
      return (card);
    })
    .then((card) => { Card.deleteOne({ _id: card._id }).then((result) => res.send(result)); })
    .catch((err) => {
      if (err.name === 'CastError') { return next(new BadRequest('Некорректный cardID')); }
      return next(err);
    });
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      res.send({ card });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') { return next(new BadRequest('Некорректный запрос')); }
      return next(err);
    });
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
      if (err.name === 'CastError') { return next(new BadRequest('Некорректный cardID')); }
      return next(err);
    });
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
      if (err.name === 'CastError') { return next(new BadRequest('Некорректный cardID')); }
      return next(err);
    });
};
