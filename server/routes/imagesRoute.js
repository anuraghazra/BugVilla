const router = require('express').Router();
const passport = require('passport');

const { User } = require('../models/userModel');
const upload = require('../middleware/fileUpload');
const UserImageController = require('../controllers/UserImageController');

const passportJWT = passport.authenticate('jwt', { session: false });
let avatarUpload = upload.single('image');

router.param('username', async (req, res, next) => {
  try {
    let user = await User.findOne({ username: req.params.username });
    if (!user) return res.notFound({ error: 'User not found!!' });

    req.foundUser = user;
    return next();
  } catch (err) {
    console.log(err);
    res.internalError({
      error: 'Something went wrong'
    })
  }
});

router.get("/me/avatar", passportJWT, UserImageController.getCurrentUserAvatar);
router.patch("/me/avatar/upload", passportJWT, avatarUpload, UserImageController.uploadProfileImage);
router.get('/:username/avatar', passportJWT, UserImageController.getAvatarImageByUsername)
router.get("/:username/avatar/raw", passportJWT, UserImageController.getRawAvatarImageByUsername);

module.exports = router