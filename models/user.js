const mongoose = require('mongoose');
const validator = require('validator');
const regex = require('../utils/const');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: false,
    default: 'Жак-Ив Кусто',
    minlength: [2, 'Минимум 2 знака'],
    maxlength: [30, 'Максимум 30 знаков'],
  },
  about: {
    type: String,
    required: false,
    default: 'Исследователь',
    minlength: [2, 'Минимум 2 знака'],
    maxlength: [30, 'Максимум 30 знаков'],
  },
  avatar: {
    type: String,
    required: false,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator(v) {
        // eslint-disable-next-line no-useless-escape
        return regex.test(v);
      },
      message: (props) => `${props.value} is not a valid url`,
    },
  },

  email: {
    type: String,
    required: true,
    unique: true,
    index: true,
    validate: validator.isEmail,
  },

  password: {
    type: String,
    required: true,
    select: false,
  },

});

module.exports = mongoose.model('user', userSchema);
