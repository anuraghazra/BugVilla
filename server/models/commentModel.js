const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
const { UserInfoSchema } = require('./userModel');
const ReactionSchema = require('./ReactionSchema');

const CommentSchema = new mongoose.Schema({
  body: {
    type: String,
    required: true,
    trim: true,
    minLength: 6,
    maxLength: 1000,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  reactions: [{ type: ReactionSchema }],
  author: { type: UserInfoSchema, required: true },
});

CommentSchema.set('toJSON', {
  transform: function (doc, ret, options) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  },
});

const Comment = mongoose.model('Comment', CommentSchema, 'bugs');

const validateComment = comment => {
  const schema = Joi.object({
    body: Joi.string().min(6).max(1000).required(),
    date: Joi.date().default(Date.now),
    author: Joi.object(),
    bugId: Joi.number(),
    reactions: Joi.array().default([]),
  });
  return schema.validate(comment);
};

module.exports.CommentSchema = CommentSchema;
module.exports.Comment = Comment;
module.exports.validateComment = validateComment;
