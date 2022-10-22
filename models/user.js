const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: [2, 'Минимум 2 знака'],
    maxlength: [30, 'Максимум 30 знаков'],
  },
  about: {
    type: String,
    required: true,
    minlength: [2, 'Минимум 2 знака'],
    maxlength: [30, 'Максимум 30 знаков'],
  },
  avatar: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('user', userSchema);
