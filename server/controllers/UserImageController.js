/// <reference path="./mytypes.d.ts" />
const mongoose = require('mongoose');
const sharp = require('sharp');
const request = require('request');
const { User } = require('../models/userModel');
const { MemCache } = require('../middleware/cache');

let gfs;
mongoose.connection.once('open', () => {
  gfs = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
    bucketName: 'images',
  });
  // gfs = Grid(mongoose.connection.db, mongoose.mongo);
  // gfs.collection('images')
});

const removeFile = id => {
  gfs.delete(id, () => {
    console.log('Removed Old User Image:', id);
  });
};

/**
 * @route PATCH /api/user/me/avatar/upload
 * @description upload profile picture of user
 * @type RequestHandler
 */
exports.uploadProfileImage = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user.id });
    if (!user) return res.notFound({ error: 'User not found' });

    // @TODO: Validate Image Dimensions

    // authorization
    // at this point its not necessary to check this
    if (user.id !== req.user.id) {
      removeFile(req.file.id);
      return res.forbidden({ error: 'not authorized' });
    }

    // if user avatar is already exists then delete the
    // old image and upload new
    if (user.avatar) {
      removeFile(user.avatar);
    }

    user.avatar = req.file.id;
    await user.save();
    MemCache.cache.clear();
    res.ok({
      avatar: user.avatar,
      message: 'uploaded',
    });
  } catch (err) {
    console.log(err);
    res.internalError({
      error: 'Something went wrong',
    });
  }
};

/**
 * @route GET /api/user/:username/avatar
 * @description upload profile picture of user
 * @type RequestHandler
 */
exports.getAvatarImageByUsername = async (req, res) => {
  try {
    const avatars = await gfs.find({ _id: req.foundUser.avatar });
    avatars.toArray((err, files) => {
      if (!files || files.length === 0) {
        return res.notFound({ error: 'Image not found' });
      }
      res.ok({ data: files[0] });
    });
  } catch (err) {
    console.log(err);
    res.internalError({
      error: 'Something went wrong',
    });
  }
};

/**
 * @route GET /api/user/:username/avatar/raw
 * @description get raw avatar image
 * @type RequestHandler
 */
exports.getRawAvatarImageByUsername = async (req, res) => {
  try {
    const cacheUrl = req.originalUrl || req.url;

    if (!req.foundUser.avatar) {
      request(
        { url: req.foundUser.avatarUrl, encoding: null },
        (err, resp, buffer) => {
          // Use the buffer
          // buffer contains the image data
          // typeof buffer === 'object'
          // res.header('Content-Type', 'image/jpeg');
          // res.header('Content-Length', file.length);
          res.header('Content-Type', 'image/jpeg');
          return res.send(buffer);
        }
      );
    } else {
      MemCache.get(cacheUrl, async cachedData => {
        if (cachedData === null) {
          console.log('cache missed');

          // get image if cache is missed
          const avatars = await gfs.find({ _id: req.foundUser.avatar });
          avatars.toArray((err, files) => {
            if (!files || files.length === 0) {
              return res.notFound({ error: 'Image not found' });
            }

            const file = files[0];
            const fileType = file.contentType;
            if (fileType === 'image/jpeg' || fileType === 'image/png') {
              res.header('Content-Type', fileType);
              res.header('Content-Length', file.length);
              // resize img
              let size = +Math.abs(req.query.size) || 200;
              if (size > 500) size = 500;

              const chunks = [];
              const stream = gfs.openDownloadStreamByName(file.filename);
              stream.on('data', chunk => chunks.push(chunk));
              stream.on('end', () => {
                const buffer = Buffer.concat(chunks);
                sharp(buffer)
                  .resize(size, size)
                  .jpeg({ quality: 100 })
                  .toBuffer((err, resizedBuffer) => {
                    try {
                      if (err || !resizedBuffer)
                        return res.send({ error: 'Cannot resize img' });
                      res.send(resizedBuffer);
                      MemCache.set(cacheUrl, resizedBuffer);
                    } catch (err) {
                      console.log('Something went wrong');
                      return res.internalError({
                        error: 'something went wrong',
                      });
                    }
                  });
              });
            } else {
              return res.unsupportedMedia({
                error: 'media type not supported',
              });
            }
          });
        } else {
          // send cached data
          res.header('Content-Type', 'image/jpeg');
          res.send(cachedData);
        }
      });
    }
  } catch (err) {
    console.log(err);
    res.internalError({ error: 'opps' });
  }
};

/**
 * @route GET /api/user/me/avatar
 * @description
 * @type RequestHandler
 */
exports.getCurrentUserAvatar = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.user.username });
    if (!user) return res.notFound({ error: 'User not found!' });

    const avatars = await gfs.find({ _id: user.avatar });
    avatars.toArray((err, files) => {
      if (!files || files.length === 0) {
        return res.notFound({ error: 'Image not found' });
      }
      res.ok({ data: files[0] });
    });
  } catch (err) {
    console.log(err);
    res.internalError({
      error: 'Something went wrong',
    });
  }
};
