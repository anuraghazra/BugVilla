const router = require('express').Router();
const verify = require('../middleware/verify')

const upload = require('../middleware/fileUpload');
const { User } = require('../models/userModel');
const UserImageController = require('../controllers/UserImageController')

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

router.get("/me/avatar", UserImageController.getCurrentUserAvatar);
router.patch("/me/avatar/upload", avatarUpload, UserImageController.uploadProfileImage);
router.get('/:username/avatar', UserImageController.getAvatarImageByUsername)
router.get("/:username/avatar/raw", UserImageController.getRawAvatarImageByUsername);

module.exports = router