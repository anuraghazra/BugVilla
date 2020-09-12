const router = require('express').Router();

const CommentsController = require('../controllers/CommentsController');

router.get('/:bugId/comments', CommentsController.getComments);
router.patch('/:bugId/comments', CommentsController.createComment);
router.get(
  '/:bugId/comments/:comment_id/reactions',
  CommentsController.getReactions
);
router.patch(
  '/:bugId/comments/:comment_id/reactions',
  CommentsController.addOrRemoveReaction
);
router.patch('/:bugId/comments/:comment_id', CommentsController.updateComment);
router.delete('/:bugId/comments/:comment_id', CommentsController.deleteComment);

module.exports = router;
