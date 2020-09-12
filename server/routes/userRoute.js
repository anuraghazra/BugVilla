const router = require('express').Router();
const passport = require('passport');

const UserController = require('../controllers/UserController');
const upload = require('../middleware/fileUpload');
const avatarUpload = upload.single('image');

const generateUserToken = require('../middleware/generateToken');
const passportJWT = passport.authenticate('jwt', { session: false });
const passportGoogle = passport.authenticate('google', {
  session: false,
});

router.get(
  '/auth/google',
  passport.authenticate('google', {
    session: false,
    scope: ['profile', 'email'],
  })
);
router.get('/auth/google/callback', passportGoogle, generateUserToken);

router.get('/', passportJWT, UserController.getAllUsers);
router.patch('/pick', passportJWT, UserController.getMultipleByIds);
router.get('/me', passportJWT, UserController.getCurrent);
router.patch('/me/bio', passportJWT, UserController.updateBio);
router.post('/check-auth', passportJWT, UserController.checkAuth);
router.post('/signup', avatarUpload, UserController.signup);
router.post('/login', UserController.login);
router.get('/logout', passportJWT, UserController.logout);
router.get('/verify-email', UserController.verifyEmail);
router.get('/:username', passportJWT, UserController.getByUsername);
router.get(
  '/:username/comments',
  passportJWT,
  UserController.getCommentsByUser
);
router.get(
  '/:username/reactions/count',
  passportJWT,
  UserController.getCollectedReactionsCount
);
router.get(
  '/:username/comments/count',
  passportJWT,
  UserController.getCommentsCountByUser
);
router.get('/:username/bugs', passportJWT, UserController.getBugsByUser);

module.exports = router;
