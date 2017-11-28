'use strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const QuestionSchema = mongoose.Schema({
  brit: {type: String},
  us: {type: String},
  score: {type: Number},
  nextIndex: {type: Number}
});

const Questions = mongoose.models.Questions || mongoose.model('Questions', QuestionSchema);

module.exports = { Questions };