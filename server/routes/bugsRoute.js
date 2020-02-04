const router = require('express').Router();
const verify = require('../middleware/verify')
const rateLimit = require('express-rate-limit');
const BugsController = require('../controllers/BugsController')

const bugOpenCloseLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour 
  max: 2,
  message: { error: "Hey stop that. don't try to break it." }
});

router.get('/suggestions', verify, BugsController.getSuggestions)
router.get('/', verify, BugsController.getBugs)
router.get('/:bugId', BugsController.getBugByNumber)
router.post('/', verify, BugsController.createBug)

router.patch('/:bugId', verify, BugsController.updateBug)
router.patch('/:bugId/references', verify, BugsController.addReferences)
router.patch('/:bugId/close', verify, bugOpenCloseLimiter, BugsController.toggleBugOpenClose({ state: false }))
router.patch('/:bugId/open', verify, BugsController.toggleBugOpenClose({ state: true }))

router.patch('/:bugId/labels', verify, BugsController.updateLabels)
// router.delete('/:bugId/labels/:name', verify, BugsController.deleteLabel)

module.exports = router;