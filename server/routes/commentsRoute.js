const router = require('express').Router();
const verify = require('../middleware/verify')

const CommentsController = require('../controllers/CommentsController');

router.get('/:bugId/comments', CommentsController.getComments);
router.patch('/:bugId/comments', verify, CommentsController.createComment);
router.patch('/:bugId/comments/:comment_id', verify, CommentsController.updateComment);
router.delete('/:bugId/comments/:comment_id', verify, CommentsController.deleteComment);

module.exports = router;