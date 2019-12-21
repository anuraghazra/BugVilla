const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
const bcrypt = require('bcryptjs');

const UserInfoSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 6,
    maxlength: 100
  },
  username: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    minlength: 6,
    maxlength: 100,
  },
})

UserInfoSchema.set('toJSON', {
  transform: function (doc, ret, options) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  }
});

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 6,
    maxlength: 100
  },
  username: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    minlength: 6,
    maxlength: 100,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minLength: 6,
    maxLength: 100,
  }
})


UserSchema.methods.setHashedPassword = function (password) {
  // Hash Password
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);
  this.password = hashedPassword;
}

// create the model
const User = mongoose.model('User', UserSchema);

// validate the inputs
const validateUser = (user) => {
  const schema = Joi.object({
    name:
      Joi.string()
        .min(6)
        .max(100)
        .required(),
    email:
      Joi.string()
        .min(5)
        .max(100)
        .required()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
    password:
      Joi.string()
        .min(6)
        .max(100)
        .required(),
    confirmPassword:
      Joi.any()
        .required()
        .valid(Joi.ref('password'))
  })
  return schema.validate(user)
}

const validateUserLogin = (user) => {
  const schema = Joi.object({
    email:
      Joi.string()
        .min(5)
        .max(100)
        .required()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
    password:
      Joi.string()
        .min(6)
        .max(100)
        .required(),
  })
  return schema.validate(user)
}

module.exports.User = User;
module.exports.UserSchema = UserSchema;
module.exports.UserInfoSchema = UserInfoSchema;
module.exports.validateUser = validateUser;
module.exports.validateUserLogin = validateUserLogin;