const router = require('express').Router();
const passport = require('passport');
const rateLimit = require('express-rate-limit');

const { User } = require('../models/userModel');
const upload = require('../middleware/fileUpload');
const UserImageController = require('../controllers/UserImageController');

const passportJWT = passport.authenticate('jwt', { session: false });
const avatarUpload = upload.single('image');

router.param('username', async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) return res.notFound({ error: 'User not found!!' });

    req.foundUser = user;
    return next();
  } catch (err) {
    console.log(err);
    res.internalError({
      error: 'Something went wrong',
    });
  }
});

// rateLimiter
const getAvatarImageRateLimit = rateLimit({
  windowMs: 25 * 60 * 1000,
  max: 1000,
  message: { error: 'Too many requests!, please try again after 25mins' },
});

router.get('/me/avatar', passportJWT, UserImageController.getCurrentUserAvatar);
router.patch(
  '/me/avatar/upload',
  passportJWT,
  avatarUpload,
  UserImageController.uploadProfileImage
);
router.get(
  '/:username/avatar',
  passportJWT,
  UserImageController.getAvatarImageByUsername
);
router.get(
  '/:username/avatar/raw',
  getAvatarImageRateLimit,
  passportJWT,
  UserImageController.getRawAvatarImageByUsername
);

module.exports = router;
