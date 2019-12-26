const router = require('express').Router();
const verify = require('../middleware/verify')

const upload = require('../middleware/fileUpload');
const UserImageController = require('../controllers/UserImageController')

let avatarUpload = upload.single('image');

router.get("/me/avatar", verify, UserImageController.getCurrentUserAvatar);
router.patch("/me/avatar/upload", verify, avatarUpload, UserImageController.uploadProfileImage);
router.get('/:username/avatar', verify, UserImageController.getAvatarImage)
router.get("/:username/avatar/raw", verify, UserImageController.getRawAvatarImage);

module.exports = router