const router = require("express").Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const slugify = require('slugify');

const verify = require('../middleware/verify')
const { User, validateUser, validateUserLogin } = require('../models/user');


// SignUp
router.post('/signup', async (req, res) => {
  // Validate request body
  const { error, value } = validateUser(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });
  const slugifiedUsername = slugify(value.name, { lower: true, })

  try {
    // add bugs reference model
    const emailExists = await User.findOne({ $or: [{ 'email': value.email }, { 'username': slugifiedUsername }] });
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
})

// Login
router.post("/login", async (req, res) => {
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
      _id: user._id,
      name: user.name,
      username: user.username
    }, process.env.TOKEN_SECRET, { expiresIn: '1h' });

    // set authorization token
    res.header("x-auth-token", token).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token
    });
  } catch (err) {
    res.status(400).json({ error: 'Something went wrong' })
  }
});

// get user by username
router.get('/:username', verify, async (req, res) => {
  try {
    let user = await User.findOne({ username: req.params.username });
    if (!user) res.status(404).json({ error: 'User Not found' })

    res.json({
      name : user.name,
      username: user.username,
      _id: user._id,
      email: user.email
    });
  } catch (err) {
    res.status(400).json({ message: 'Something went wrong', error: err })
  }
})

module.exports = router;