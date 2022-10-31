const jwt = require('jsonwebtoken');
const Error401 = require('../errors/Error401');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new Error401({ message: 'Необходима авторизация' });
  }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, 'something_4_mistery');
  } catch (err) { throw new Error401({ message: 'Необходима авторизация' }); }
  req.user = { _id: payload };
  next();
};
