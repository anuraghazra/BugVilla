const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
const autoIncrement = require('mongoose-auto-increment');
const User = require('./user');

// plugin initialize
autoIncrement.initialize(mongoose.connection);


const colorRegEx = (/^#([0-9a-f]{3}){1,2}$/i);
const colorValidator = (v) => colorRegEx.test(v)

const LabelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minLength: 2,
    maxLength: 50,
    unique: true,
  },
  // TODO: validate color properly
  color: {
    type: String,
    required: true,
    minLength: 4,
    maxLength: 10,
    validate: [colorValidator, 'Invalid Color Hex']
  }
}, { _id: false })

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
  labels: { type: [LabelSchema], default: [], unique: true },
  date_opened: {
    type: Date,
    default: Date.now
  },
  author: { type: User, required: true },
  // author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isOpen: { type: mongoose.Schema.Types.Boolean, default: true }
})

// enable plugin
BugScheme.plugin(autoIncrement.plugin, { model: 'Bug', field: 'bugId' });
// create the model
const Bug = mongoose.model('Bug', BugScheme, 'bugs');


const labelSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  color: Joi.string().regex(colorRegEx).required()
})

const validateLabel = (label) => {
  return labelSchema.validate(label)
}
const validateBug = (bug) => {
  // nested schemas
  const schema = Joi.object({
    title: Joi.string().min(6).max(100).required(),
    body: Joi.string().min(6).max(10000).required(),
    labels: Joi.array().items(labelSchema).default([]),
    date_opened: Joi.date().default(Date.now),
    author: Joi.object(),
    isOpen: Joi.bool().default(true),
  })
  return schema.validate(bug)
}

module.exports.Bug = Bug;
module.exports.validateBug = validateBug;
module.exports.validateLabel = validateLabel;