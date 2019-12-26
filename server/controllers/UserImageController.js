/// <reference path="./mytypes.d.ts" />
const mongoose = require('mongoose');
const Grid = require("gridfs-stream");
const { User } = require('../models/userModel');

// init gfs
let gfs;
mongoose.connection.once("open", () => {
  // gfs = new mongoose.mongo.GridFSBucket(conn.db, { bucketName: "images" });
  gfs = Grid(mongoose.connection.db, mongoose.mongo);
  gfs.collection('images')
});

const removeFile = (id) => {
  gfs.remove({ _id: id, root: 'images' }, (err) => {
    if (err) return res.notFound({ err: err.message });
    console.log('Removed', id)
  })
}

/**
 * @route PATCH /api/user/:username/upload
 * @description upload profile picture of user
 * @type RequestHandler
 */
exports.uploadProfileImage = async (req, res) => {
  try {
    let user = await User.findOne({ _id: req.user.id });
    if (!user) return res.notFound({ error: 'User not found' });

    // authorization 
    // at this point its not necessary to check this
    if (user.id !== req.user.id) {
      removeFile(req.file.id);
      return res.forbidden({ error: 'not authorized' })
    }

    // if user avatar is already exists then delete the 
    // old image and upload new
    if (user.avatar) {
      removeFile(user.avatar);
    }

    user.avatar = req.file.id;
    await user.save();

    res.ok({
      avatar: user.avatar,
      message: 'uploaded'
    })
  } catch (err) {
    console.log(err);
    res.internalError({
      error: 'Something went wrong'
    })
  }
}

/**
 * @route GET /api/user/:username/avatar
 * @description upload profile picture of user
 * @type RequestHandler
 */
exports.getAvatarImage = async (req, res) => {
  try {
    let user = await User.findOne({ username: req.params.username });
    if (!user) return res.notFound({ error: 'User not found' });

    let file = await gfs.files.findOne({ _id: user.avatar })
    if (!file || file.length === 0) {
      return res.status(404).json({
        err: "no file exist"
      });
    }
    res.ok({ data: file })
  } catch (err) {
    console.log(err);
    res.internalError({
      error: 'Something went wrong'
    })
  }
}

/**
 * @route GET /api/user/:username/avatar/raw
 * @description upload profile picture of user
 * @type RequestHandler
 */
exports.getRawAvatarImage = async (req, res) => {
  try {
    let user = await User.findOne({ username: req.params.username });
    if (!user) return res.notFound({ error: 'User not found' });

    let file = await gfs.files.findOne({ _id: user.avatar })
    if (!file || file.length === 0) {
      return res.status(404).json({
        err: "no file exist"
      });
    }

    if (file.contentType === 'image/jpeg' || file.contentType === 'image/png') {
      res.header('Content-Type', file.contentType);
      res.header('Content-Length', file.length);

      const readStream = gfs.createReadStream(file.filename);
      readStream.pipe(res);
    } else {
      return res.unsupportedMedia({ error: 'media type not supported' })
    }
  } catch (err) {
    console.log(err);
    res.internalError({ error: 'opps' })
  }
}


/**
 * @route GET /api/user/me/avatar
 * @description 
 * @type RequestHandler
 */
exports.getCurrentUserAvatar = async (req, res) => {
  try {
    let user = await User.findOne({ username: req.user.username });
    if (!user) return res.notFound({ error: 'User not found!!' });

    let file = await gfs.files.findOne({ _id: user.avatar })
    if (!file || file.length === 0) {
      return res.status(404).json({
        err: "no file exist"
      });
    }
    res.ok({ data: file })
  } catch (err) {
    console.log(err);
    res.internalError({
      error: 'Something went wrong'
    })
  }
}