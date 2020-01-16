/// <reference path="./mytypes.d.ts" />
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const slugify = require('slugify');

const { User, validateUser, validateUserLogin } = require('../models/userModel');
const { Bug } = require('../models/bugModel');


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
  const slugifiedUsername = slugify(value.username, { lower: true, })
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
    if (!req.file) {
      return res.unprocessable({ error: "Please Select An Image" })
    }

    const newUser = new User({
      name: value.name,
      username: slugifiedUsername,
      email: value.email,
      password: value.password,
      avatar: req.file.id
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
    console.log(err)
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
        username: user.username,
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
 * @route GET /user/verify
 * @type RequestHandler
 */
exports.verifyUser = async (req, res) => {
  try {
    if (!req.user) return res.forbidden({ error: "Invalid User" })
    res.ok({
      data: {
        id: req.user.id,
        name: req.user.name,
        username: req.user.username,
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
    let user = await User.findOne({ username: req.params.username }).select('-password');
    if (!user) return res.notFound({ error: `User not found with the username ${req.params.username}` })

    res.ok({ data: user });
  } catch (err) {
    console.log(err)
    res.internalError({
      error: 'Something went wrong'
    });
  }
}

/**
 * @route GET /user/
 * @type RequestHandler
 */
exports.getAllUsers = async (req, res) => {
  try {
    let users = await User.find({}).select('-password -email');
    if (!users) return res.notFound({ error: `No users found!` })

    res.ok({ data: users });
  } catch (err) {
    console.log(err)
    res.internalError({
      error: 'Something went wrong while getting users'
    });
  }
}

/**
 * @route GET /user/me
 * @type RequestHandler
 */
exports.getCurrent = async (req, res) => {
  try {
    let user = await User.findOne({ _id: req.user.id }).select('-password')
    if (!user) return res.notFound({ error: "User Not Found!" })

    res.ok({ data: user });
  } catch (err) {
    res.internalError({
      error: 'Something went wrong'
    });
  }
}

/**
 * @route GET /user/:username/comments
 * @type RequestHandler
 */
exports.getCommentsByUser = async (req, res) => {
  try {
    // https://stackoverflow.com/questions/16845191/mongoose-finding-subdocuments-by-criteria
    let bug = await Bug.aggregate([
      { $match: { 'comments.author.username': req.params.username } },
      { $unwind: '$comments' },
      { $match: { 'comments.author.username': req.params.username } },
      {
        $project: {
          body: '$comments.body',
          date: '$comments.date',
          author: {
            id: '$comments.author._id',
            username: '$comments.author.username',
            name: '$comments.author.name'
          },
          'id': '$_id',
          _id: 0,
        },
      },
    ])

    if (!bug) return res.notFound({ error: "Bug Not Found!" })
    res.ok({ data: bug });
  } catch (err) {
    console.log(err)
    res.internalError({
      error: 'Something went wrong'
    });
  }
}

/**
 * @route GET /user/:username/comments/count
 * @type RequestHandler
 */
exports.getCommentsCountByUser = async (req, res) => {
  try {
    // https://docs.mongodb.com/manual/reference/operator/aggregation/count/
    let data = await Bug.aggregate([
      { $match: { 'comments.author.username': req.params.username } },
      { $unwind: '$comments' },
      { $match: { 'comments.author.username': req.params.username } },
      {
        $count: "counts"
      }
    ])

    if (!data) return res.notFound({ error: "Not Found!" })
    res.ok({ data: data[0] || { count: '0' } });
  } catch (err) {
    console.log(err)
    res.internalError({
      error: 'Something went wrong'
    });
  }
}

/**
 * @route GET /user/:username/bugs
 * @type RequestHandler
 */
exports.getBugsByUser = async (req, res) => {
  try {
    let bug = await Bug.find({ 'author.username': req.params.username })
    if (!bug) return res.notFound({ error: "Bug Not Found!" })

    res.ok({ data: bug });
  } catch (err) {
    console.log(err)
    res.internalError({
      error: 'Something went wrong'
    });
  }
}