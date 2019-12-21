const router = require('express').Router();
const verify = require('../middleware/verify')

const { Bug } = require('../models/bugModel');
const { validateComment } = require('../models/commentModel');

// GET all comments with a specified bugId
router.get('/:bugId/comments', verify, async (req, res) => {
  try {
    const { comments } = await Bug.findOne({ bugId: req.params.bugId })
    res.json(comments);
  } catch (err) {
    res.status(400).json({ message: 'Something went wrong while adding new comment', error: err })
  }
})

// add a comments to a specified bugId
router.post('/:bugId/comments', verify, async (req, res) => {
  const { error, value } = validateComment(req.body);

  if (error) return res.status(400).json({ error: error.details[0].message });

  try {
    const bug = await Bug.findOne({ bugId: req.params.bugId })
    let authorDetails = {
      username: req.user.username,
      name: req.user.name,
      _id: req.user._id
    }
    bug.comments.push({
      body: value.body,
      author: authorDetails
    })
    const newBug = await bug.save()
    res.json(newBug);
  } catch (err) {
    res.status(400).json({ message: 'Something went wrong while adding new comment', error: err })
  }
})

// remove a comments from specified bugId
router.delete('/:bugId/comments/:comment_id', verify, async (req, res) => {
  try {
    let comment = await Bug.findOneAndUpdate(
      { bugId: req.params.bugId },
      { $pull: { "comments": { _id: req.params.comment_id } } },
      { new: true }
    );
    if (!comment) res.status(404).json({ error: 'Not found' })

    res.json(comment);
  } catch (err) {
    res.status(400).json({ message: 'Something went wrong', error: err })
  }
})

module.exports = router;