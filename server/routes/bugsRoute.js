const router = require('express').Router();
const rateLimit = require('express-rate-limit');
const BugsController = require('../controllers/BugsController');

const bugOpenCloseLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 2,
  message: { error: "Hey stop that. don't try to break it." },
});

router.get('/suggestions', BugsController.getSuggestions);
router.get('/', BugsController.getBugs);
router.get('/:bugId', BugsController.getBugByNumber);
router.post('/', BugsController.createBug);

router.patch('/:bugId', BugsController.updateBug);
router.patch('/:bugId/references', BugsController.addReferences);
router.patch(
  '/:bugId/close',
  bugOpenCloseLimiter,
  BugsController.toggleBugOpenClose({ state: false })
);
router.patch(
  '/:bugId/open',
  BugsController.toggleBugOpenClose({ state: true })
);

router.patch('/:bugId/labels', BugsController.updateLabels);
router.get('/:bugId/reactions', BugsController.getReactions);
router.patch('/:bugId/reactions', BugsController.addOrRemoveReaction);
router.get('/:bugId/reactions/:username', BugsController.getReactionsByUsers);
router.get('/:bugId/timeline', BugsController.getTimeline);
// router.delete('/:bugId/labels/:name', verify, BugsController.deleteLabel)

module.exports = router;
