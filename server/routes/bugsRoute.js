const router = require('express').Router();
const verify = require('../middleware/verify')

const BugsController = require('../controllers/BugsController')

router.get('/', verify, BugsController.getBugs)
router.get('/:id', verify, BugsController.getBugByNumber)
router.post('/', verify, BugsController.createBug)

router.put('/:id/close', verify, BugsController.toggleBugOpenClose({ state: false }))
router.put('/:id/open', verify, BugsController.toggleBugOpenClose({ state: true }))

router.put('/:id/labels', BugsController.addLabel)
router.delete('/:id/labels/:name', BugsController.deleteLabel)

module.exports = router;