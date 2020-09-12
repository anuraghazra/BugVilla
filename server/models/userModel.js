const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
const bcrypt = require('bcryptjs');

const UserInfoSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 6,
    maxlength: 100,
  },
  username: {
    type: String,
    required: true,
    trim: true,
    minlength: 6,
    maxlength: 100,
  },
});

UserInfoSchema.set('toJSON', {
  transform: function (doc, ret, options) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  },
});

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 6,
      maxlength: 100,
    },
    username: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
      unique: true,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      minLength: 6,
      maxLength: 100,
    },
    bio: {
      type: String,
      minLength: 6,
      maxLength: 200,
      default: '404 Bio Not Found',
    },
    avatar: {
      type: mongoose.Schema.Types.ObjectId,
    },
    avatarUrl: {
      type: String,
      required: true,
    },
    date_joined: {
      type: Date,
      default: Date.now,
    },
    // new auth
    isVerified: { type: Boolean, default: false },
    provider: { type: [String], enum: ['google', 'local'], required: true },
    googleId: { type: String },
  },
  { timestamps: true }
);

UserSchema.set('toJSON', {
  transform: function (doc, ret, options) {
    ret.id = ret._id;
    delete ret.password;
    delete ret._id;
    delete ret.__v;
  },
});

UserSchema.pre('save', function (next) {
  if (!this.provider.includes('local')) next();
  // don't rehash the password everytime
  if (this.isModified('password') || this.isNew) {
    try {
      // Hash Password
      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(this.password, salt);
      this.password = hashedPassword;
      next();
    } catch (err) {
      next(err);
    }
  } else {
    return next();
  }
});

UserSchema.methods.isValidPassword = async function (password) {
  try {
    // Check/Compares password
    return await bcrypt.compare(password, this.password);
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
};

// set TTL
// https://stackoverflow.com/a/35179159/10629172
UserSchema.index(
  { createdAt: 1 },
  {
    expireAfterSeconds: 60 * process.env.EXPIRATION_TIME,
    partialFilterExpression: {
      isVerified: false,
    },
  }
);

// create the model
const User = mongoose.model('User', UserSchema);

// validate the inputs
const validateUser = user => {
  const schema = Joi.object({
    name: Joi.string()
      .pattern(/^[a-zA-Z0-9\s]+$/, 'Name should not contain special symbols')
      .min(6)
      .max(100)
      .required(),
    email: Joi.string()
      .min(5)
      .max(100)
      .required()
      .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
    password: Joi.string().min(6).max(100).required(),
    confirmPassword: Joi.any().required().valid(Joi.ref('password')),
    avatar: Joi.string(),
    date_joined: Joi.date().default(Date.now),
  });
  return schema.validate(user);
};

const validateUserLogin = user => {
  const schema = Joi.object({
    email: Joi.string()
      .min(5)
      .max(100)
      .required()
      .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
    password: Joi.string().min(6).max(100).required(),
  });
  return schema.validate(user);
};

module.exports.User = User;
module.exports.UserSchema = UserSchema;
module.exports.UserInfoSchema = UserInfoSchema;
module.exports.validateUser = validateUser;
module.exports.validateUserLogin = validateUserLogin;
