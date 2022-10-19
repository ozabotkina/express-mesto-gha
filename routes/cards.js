const router = require('express').Router();

const {
  getCards, getCard, createCard, likeCard, dislikeCard,
} = require('../controllers/cards');

router.get('/', getCards);

router.get('/:cardId', getCard);

router.post('/', createCard);

router.put('/:cardId/likes', likeCard);

router.delete('/:cardId/likes', dislikeCard);

module.exports = router;
