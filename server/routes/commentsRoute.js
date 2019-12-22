const router = require('express').Router();
const verify = require('../middleware/verify')

const CommentsController = require('../controllers/CommentsController');

router.get('/:bugId/comments', verify, CommentsController.getComments);
router.put('/:bugId/comments', verify, CommentsController.createComment);
router.delete('/:bugId/comments/:comment_id', verify, CommentsController.deleteComment);

module.exports = router;