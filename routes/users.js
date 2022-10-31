const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getUsers, getUser, updateUser, updateAvatar, currentUser,
} = require('../controllers/users');

router.get('/', getUsers);

router.get('/me', currentUser);

router.get(
  '/:UserId',
  celebrate({
    params: Joi.object().keys({
      UserId: Joi.string().alphanum().length(24),
    }),
  }),
  getUser,
);

router.patch(
  '/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
    }),
  }),
  updateUser,
);

router.patch(
  '/me/avatar',
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string().uri(),
    }),
  }),
  updateAvatar,
);

module.exports = router;
