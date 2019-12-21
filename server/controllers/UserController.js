/// <reference path="./mytypes.d.ts" />
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const slugify = require('slugify');
const { User, validateUser, validateUserLogin } = require('../models/userModel');



/**
 * @method signup
 * @type RequestHandler
 */
exports.signup = async (req, res) => {
  const { error, value } = validateUser(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  // create username for the user with their name.
  const slugifiedUsername = slugify(value.name, { lower: true, })
  try {
    // add bugs reference model
    const emailExists = await User.findOne({
      $or: [
        { 'email': value.email },
        { 'username': slugifiedUsername }
      ]
    });
    if (emailExists) return res.status(400).json({ error: "Username / Email Already Exsist" });

    const newUser = new User({
      name: value.name,
      username: slugifiedUsername,
      email: value.email,
      password: value.password
    });
    newUser.setHashedPassword(value.password);

    // save the user data into database
    const savedUser = await newUser.save();
    res.json({ msg: "User Registered", _id: savedUser._id });
  } catch (err) {
    res.status(400).json({ error: 'Something went wrong' })
  }
}


/**
 * @method login
 * @type RequestHandler
 */
exports.login = async (req, res) => {
  // Validate request body
  const { error, value } = validateUserLogin(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  try {
    // check if user exist
    const user = await User.findOne({ email: value.email });
    if (!user) return res.status(400).json({ error: "Email does not exsist" });

    // Check/Compares password
    const validPassword = await bcrypt.compare(value.password, user.password);
    if (!validPassword) return res.status(401).json({ error: "Password is incorrect" });

    // Create JWT Token
    const token = jwt.sign({
      id: user.id,
      name: user.name,
      username: user.username
    }, process.env.TOKEN_SECRET, { expiresIn: '4h' });

    // set authorization token
    res.setHeader("authorization", token);
    res.status(200).json({
      id: user.id,
      name: user.name,
      email: user.email,
      token
    });
  } catch (err) {
    res.status(400).json({ error: 'Something went wrong' })
  }
}


/**
 * @method getByUsername
 * @type RequestHandler
 */
exports.getByUsername = async (req, res) => {
  try {
    let user = await User.findOne({ username: req.params.username });
    if (!user) res.status(404).json({ error: 'User Not found' })

    res.json({
      name: user.name,
      username: user.username,
      email: user.email,
      id: user.id,
    });
  } catch (err) {
    res.status(400).json({ message: 'Something went wrong', error: err })
  }
}