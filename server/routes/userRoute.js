const router = require("express").Router();
const verify = require('../middleware/verify')
const UserController = require('../controllers/UserController');
const upload = require('../middleware/fileUpload');
let avatarUpload = upload.single('image');

router.get('/me', verify, UserController.getCurrent);
router.get('/verify', verify, UserController.verifyUser);
router.post('/signup', avatarUpload, UserController.signup);
router.post("/login", UserController.login);
router.get('/:username', UserController.getByUsername);
router.get('/:username/comments', UserController.getCommentsByUser);
router.get('/:username/bugs', UserController.getBugsByUser);


module.exports = router;