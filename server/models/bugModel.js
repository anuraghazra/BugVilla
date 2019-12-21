const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
const autoIncrement = require('mongoose-auto-increment');
const { UserInfoSchema } = require('./userModel');
const { CommentSchema } = require('./commentModel');


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
  color: {
    type: String,
    required: true,
    minLength: 4,
    maxLength: 10,
    validate: [colorValidator, 'Invalid Color Hex']
  }
}, { _id: false })

const BugSchema = new mongoose.Schema({
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
  date_opened: {
    type: Date,
    default: Date.now
  },
  isOpen: { type: mongoose.Schema.Types.Boolean, default: true },
  labels: { type: [LabelSchema], default: [], unique: true },
  author: { type: UserInfoSchema, required: true },
  comments: { type: [CommentSchema], default: [] }
})

BugSchema.set('toJSON', {
  transform: function (doc, ret, options) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  }
});

// enable plugin
BugSchema.plugin(autoIncrement.plugin, { model: 'Bug', field: 'bugId' });
// create the model
const Bug = mongoose.model('Bug', BugSchema, 'bugs');


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
    labels: Joi.array().unique().items(labelSchema).default([]),
    date_opened: Joi.date().default(Date.now),
    author: Joi.object(),
    isOpen: Joi.bool().default(true),
  })
  return schema.validate(bug)
}

module.exports.Bug = Bug;
module.exports.validateBug = validateBug;
module.exports.validateLabel = validateLabel;