/// <reference path="./mytypes.d.ts" />
const mongoose = require('mongoose');
const { User } = require('../models/userModel');


let gfs;
mongoose.connection.once("open", () => {
  gfs = new mongoose.mongo.GridFSBucket(mongoose.connection.db, { bucketName: "images" });
  // gfs = Grid(mongoose.connection.db, mongoose.mongo);
  // gfs.collection('images')
});

const removeFile = (id) => {
  gfs.delete(id, () => {
    console.log('Removed Old User Image:', id)
  })
}

/**
 * @route PATCH /api/user/me/avatar/upload
 * @description upload profile picture of user
 * @type RequestHandler
 */
exports.uploadProfileImage = async (req, res) => {
  try {
    let user = await User.findOne({ _id: req.user.id });
    if (!user) return res.notFound({ error: 'User not found' });

    // @TODO: Validate Image Dimensions
    
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
exports.getAvatarImageByUsername = async (req, res) => {
  try {
    let avatars = await gfs.find({ _id: req.foundUser.avatar })
    avatars.toArray((err, files) => {
      if (!files || files.length === 0) {
        return res.notFound({ error: "Image not found" });
      }
      res.ok({ data: files[0] })
    })
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
exports.getRawAvatarImageByUsername = async (req, res) => {
  try {
    let avatars = await gfs.find({ _id: req.foundUser.avatar })
    avatars.toArray((err, files) => {
      if (!files || files.length === 0) {
        return res.notFound({ error: "Image not found" });
      }

      let file = files[0];
      if (file.contentType === 'image/jpeg' || file.contentType === 'image/png') {
        res.header('Content-Type', file.contentType);
        res.header('Content-Length', file.length);

        gfs.openDownloadStreamByName(file.filename).pipe(res);
      } else {
        return res.unsupportedMedia({ error: 'media type not supported' })
      }
    })
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
    if (!user) return res.notFound({ error: 'User not found!' });

    let avatars = await gfs.find({ _id: user.avatar })
    avatars.toArray((err, files) => {
      if (!files || files.length === 0) {
        return res.notFound({ error: "Image not found" });
      }
      res.ok({ data: files[0] })
    })
  } catch (err) {
    console.log(err);
    res.internalError({
      error: 'Something went wrong'
    })
  }
}