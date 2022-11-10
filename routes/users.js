const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const regex = require('../utils/const');

const {
  getUsers, getUser, updateUser, updateAvatar, currentUser,
} = require('../controllers/users');

router.get('/', getUsers);

router.get('/me', currentUser);

router.get(
  '/:UserId',
  celebrate({
    params: Joi.object().keys({
      UserId: Joi.string().alphanum().length(24).hex()
        .required(),
    }),
  }),
  getUser,
);

router.patch(
  '/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30).required(),
      about: Joi.string().min(2).max(30).required(),
    }),
  }),
  updateUser,
);

router.patch(
  '/me/avatar',
  celebrate({
    body: Joi.object().keys({
      // eslint-disable-next-line no-useless-escape
      avatar: Joi.string().uri().pattern(regex).required(),
    }),
  }),
  updateAvatar,
);

module.exports = router;
