const jwt = require('jsonwebtoken');
const Error401 = require('../errors/Error401');
const Error403 = require('../errors/Error403');

const User = require('../models/user');

const tokenAuth = (req, res, next) => {
  const { authorization } = req.headers;

  try {
    if (!authorization || !authorization.startsWith('Bearer ')) {
      throw new Error401('Необходима аторизация');
    }
    const token = authorization.replace('Bearer ', '');
    let payload;
    // eslint-disable-next-line prefer-const
    payload = jwt.verify(token, 'something_4_mistery');
    User.findOne({ _id: payload._id }).then((user) => { if (!user) { throw new Error403({ message: 'Нет прав доступа' }); } });
    req.user = { _id: payload };
  } catch (err) {
    next(new Error401('Необходима авторизация'));
  }
  next();
};

module.exports = tokenAuth;
