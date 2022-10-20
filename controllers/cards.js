
const Card = require('../models/card');
const { NotFoundError, GeneralError, BadRequest} = require('../utils/errors.js');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ cards }))
    .catch(() => res.status(GeneralError).send({ message: 'Произошла ошибка' }));
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndDelete(req.params.cardId)
  .then((card) => { if(!card){res.status(NotFoundError).send({ message: 'Запрашиваемая карточка не найдена' })} else {
    res.send(card)}})
  .catch((err) => {
      if (err.name === 'CastError') { res.status(BadRequest).send({ message: 'Запрашиваемая карточка не найдена' }); return; }
      res.status(GeneralError).send({ message: 'Произошла ошибка' });
    });
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ card }))
    .catch((err) => {
      if (err.name === 'ValidationError') { res.status(BadRequest).send({ message: 'Некорректный запрос' }); return; }
      res.status(GeneralError).send({ message: 'Произошла ошибка' });
    });
};

module.exports.likeCard = (req, res) => {

  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true, runValidators: true},
  )
    .then((card) => {
      if (!card){res.status(NotFoundError).send({ message: 'Запрашиваемая карточка не найдена'}); return; } else {
      res.send({ card });}
    })
    .catch((err) => {
      if (err.name === 'ValidationError') { res.status(BadRequest).send({ message: 'Некорректный запрос' }); return; }
      if (err.name === 'CastError') { res.status(BadRequest).send({ message: 'Запрашиваемая карточка не найдена' }); return; }
      res.status(GeneralError).send({ message: 'Произошла ошибка' });
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true, runValidators: true },
  )
  .then((card) => {
    if (!card){res.status(NotFoundError).send({ message: 'Запрашиваемая карточка не найдена'}); return; } else {
    res.send({ card });}
  })
  .catch((err) => {
    if (err.name === 'ValidationError') { res.status(BadRequest).send({ message: 'Некорректный запрос' }); return; }
    if (err.name === 'CastError') { res.status(BadRequest).send({ message: 'Запрашиваемая карточка не найдена' }); return; }
    res.status(GeneralError).send({ message: 'Произошла ошибка' });
  });
};
