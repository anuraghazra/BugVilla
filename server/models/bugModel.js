const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
const autoIncrement = require('mongoose-auto-increment');
const { UserInfoSchema } = require('./userModel');
const { CommentSchema } = require('./commentModel');


// plugin initialize
autoIncrement.initialize(mongoose.connection);

const ActivitiesSchema = new mongoose.Schema({
  action: { type: String, enum: ['closed', 'opened'], required: true },
  author: { type: UserInfoSchema, required: true },
  date: {
    type: Date,
    default: Date.now
  },
}, { _id: false })


const VALID_LABELS = ["bug", "feature", "help wanted", "enhancement"];
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
    maxLength: 1000
  },
  date_opened: {
    type: Date,
    default: Date.now
  },
  isOpen: { type: Boolean, default: true },
  activities: [{ type: ActivitiesSchema }],
  author: { type: UserInfoSchema, required: true },
  labels: {
    type: [String],
    enum: VALID_LABELS,
  },
  comments: [{ type: CommentSchema }]
}, { strict: true })

BugSchema.set('toJSON', {
  transform: function (doc, ret, options) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  }
});

// enable plugin
BugSchema.plugin(autoIncrement.plugin, { model: 'Bug', field: 'bugId', startAt: 1 });
// create the model
const Bug = mongoose.model('Bug', BugSchema, 'bugs');


const JoiLabelSchema = Joi.array()
  .items(Joi
    .string()
    .min(2)
    .max(50)
    .required()
  )

const validateLabel = (label) => {
  return JoiLabelSchema.validate(label)
}

const validateBug = (bug) => {
  // nested schemas
  const schema = Joi.object({
    title: Joi.string().min(6).max(100).required(),
    body: Joi.string().min(6).max(1000).required(),
    date_opened: Joi.date().default(Date.now),
    author: Joi.object(),
    isOpen: Joi.bool().default(true),
  })
  return schema.validate(bug)
}

module.exports.Bug = Bug;
module.exports.validateBug = validateBug;
module.exports.validateLabel = validateLabel;