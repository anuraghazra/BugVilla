const mongoose = require('mongoose');
const Joi = require('@hapi/joi');

const LabelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minLength: 2,
    maxLength: 50,
  },
  // TODO: validate color properly
  color: {
    type: String,
    required: true,
    minLength: 4,
    maxLength: 10,
  }
})

const BugScheme = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 6,
    maxlength: 100
  },
  body: {
    type: String,
    required: true,
    maxLength: 10000
  },
  labels: { type: [LabelSchema], default: [] },
  date: {
    type: Date,
    default: Date.now
  },
  author: {
    type: String,
    required: true,
    minLength: 6,
    maxLength: 100,
  },
  isOpen: { type: mongoose.Schema.Types.Boolean, default: true }
})

// create the model
const Bug = mongoose.model('Bug', BugScheme);


module.exports.Bug = Bug;