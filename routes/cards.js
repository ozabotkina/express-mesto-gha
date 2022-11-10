/* eslint-disable no-useless-escape */
const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getCards, deleteCard, createCard, likeCard, dislikeCard,
} = require('../controllers/cards');
const regex = require('../utils/const');

router.get('/', getCards);

router.delete(
  '/:cardId',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().alphanum().length(24).hex()
        .required(),
    }),
  }),
  deleteCard,
);

router.post(
  '/',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      link: Joi.string().required().uri().pattern(regex),
    }),
  }),
  createCard,
);

router.put(
  '/:cardId/likes',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().alphanum().length(24).hex()
        .required(),
    }),
  }),

  likeCard,
);

router.delete(
  '/:cardId/likes',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().alphanum().length(24).hex()
        .required(),
    }),
  }),
  dislikeCard,
);

module.exports = router;
