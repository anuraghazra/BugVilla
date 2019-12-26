/// <reference path="./mytypes.d.ts" />
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const slugify = require('slugify');

const { User, validateUser, validateUserLogin } = require('../models/userModel');


/**
 * @route POST /user/signup
 * @type RequestHandler
 */
exports.signup = async (req, res) => {
  const { error, value } = validateUser(req.body);
  if (error) {
    return res.unprocessable({ error: error.details[0].message })
  }

  // create username for the user with their name.
  const slugifiedUsername = slugify(value.name, { lower: true, })
  try {
    // add bugs reference model
    const foundUser = await User.findOne({
      $or: [
        { 'email': value.email },
        { 'username': slugifiedUsername }
      ]
    });
    if (foundUser) {
      return res.conflict({ error: "Username / Email Already Exsist" })
    }

    const newUser = new User({
      name: value.name,
      username: slugifiedUsername,
      email: value.email,
      password: value.password
    });
    newUser.setHashedPassword(value.password);

    // save the user data into database
    const savedUser = await newUser.save();

    res.created({
      data: {
        id: savedUser.id,
        username: savedUser.username,
        name: savedUser.name,
        message: "User Registered",
      }
    });
  } catch (err) {
    res.internalError({
      error: 'Something went wrong'
    });
  }
}


/**
 * @route POST /user/login
 * @type RequestHandler
 */
exports.login = async (req, res) => {
  const { error, value } = validateUserLogin(req.body);
  if (error) {
    return res.unprocessable({ error: error.details[0].message })
  }

  try {
    // check if user exist
    const user = await User.findOne({ email: value.email });
    if (!user) return res.notFound({ error: "Email does not exsist" });

    // Check/Compares password
    const validPassword = await bcrypt.compare(value.password, user.password);
    if (!validPassword) {
      return res.forbidden({ error: "Password is incorrect" })
    }

    // Create JWT Token
    const token = jwt.sign({
      id: user.id,
      name: user.name,
      username: user.username
    }, process.env.TOKEN_SECRET, { expiresIn: '4h' });

    // set authorization token
    res.setHeader("Authorization", token);

    res.ok({
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        token
      }
    });
  } catch (err) {
    res.internalError({
      error: 'Something went wrong'
    });
  }
}


/**
 * @route GET /user/:username
 * @type RequestHandler
 */
exports.getByUsername = async (req, res) => {
  try {
    let user = await User.findOne({ username: req.params.username });
    if (!user) return res.notFound({ error: `User not found with the username ${req.params.username}` })

    res.ok({
      data: {
        name: user.name,
        username: user.username,
        email: user.email,
        id: user.id,
      }
    });
  } catch (err) {
    console.log(err)
    res.internalError({
      error: 'Something went wrong'
    });
  }
}

/**
 * @route GET /user/me
 * @type RequestHandler
 */
exports.getCurrent = async (req, res) => {
  try {
    let user = await User.findOne({ _id: req.user.id });
    if (!user) return res.notFound({ error: "User Not Found!" })

    res.ok({
      data: {
        name: user.name,
        username: user.username,
        email: user.email,
        id: user.id,
        avatar: user.avatar
      }
    });
  } catch (err) {
    res.internalError({
      error: 'Something went wrong'
    });
  }
}