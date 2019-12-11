const router = require("express").Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const slugify = require('slugify');

const { User, validateUser, validateUserLogin } = require('../models/user');


// SignUp
router.post('/signup', async (req, res) => {
  // Validate request body
  const { error, value } = validateUser(req.body);
  if (error) return res.status(400).json(error.details[0].message);
  const slugifiedUsername = slugify(value.name, { lower: true, })
  try {
    // check for existing email/user
    // TODO check for user/email exist and update usernames
    // add bugs reference model
    const emailExists = await User.findOne({ email: value.email });
    const usernameExists = await User.findOne({ username: slugifiedUsername });
    if (emailExists || usernameExists) return res.status(400).json({ error: "Username / Email Already Exsist" });

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
    res.json({ error: 'something went wrong' })
    throw new Error(err);
  }
})

// Login
router.post("/login", async (req, res) => {
  // Validate request body
  const { error, value } = validateUserLogin(req.body);
  if (error) return res.status(400).send(error.details[0].message);


  try {
    // check if user exist
    const user = await User.findOne({ email: value.email });
    if (!user) return res.status(400).send("Email does not exsist");

    // Check/Compares password
    const validPassword = await bcrypt.compare(value.password, user.password);
    if (!validPassword) return res.status(401).send("Password is incorrect");

    // Create JWT Token
    const token = jwt.sign({
      _id: user._id,
      name: user.name
    }, process.env.TOKEN_SECRET, { expiresIn: '1h' });

    // set authorization token
    res.header("x-auth-token", token).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token
    });
  } catch (err) {
    throw new Error(err);
  }
});


module.exports = router;