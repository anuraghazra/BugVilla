/// <reference path="./mytypes.d.ts" />
const { Bug } = require('../models/bugModel');
const { validateComment } = require('../models/commentModel');


/**
 * @method signup
 * @description GET all comments with a specified bugId
 * @type RequestHandler
 */
exports.getComments = async (req, res) => {
  try {
    const { comments } = await Bug.findOne({ bugId: req.params.bugId })
    if (!comments) return res.notFound({ error: 'Not Found' })

    res.ok(comments);
  } catch (err) {
    res.internalError({
      error: 'Something went wrong while getting comments',
    })
  }
}

/**
 * @method signup
 * @description add a comments to a specified bugId
 * @type RequestHandler
 */
exports.createComment = async (req, res) => {
  const { error, value } = validateComment(req.body);

  if (error) return res.unprocessable({ error: error.details[0].message });

  try {
    const bug = await Bug.findOne({ bugId: req.params.bugId });
    if (!bug) return res.notFound({ error: `Bug#${req.params.bugId} Not Found` });

    let authorDetails = {
      username: req.user.username,
      name: req.user.name,
      _id: req.user._id
    };

    bug.comments.push({
      body: value.body,
      author: authorDetails
    });

    const newBug = await bug.save();
    res.ok(newBug);
  } catch (err) {
    res.internalError({
      error: 'Something went wrong while adding new comment',
    })
  }
}

/**
 * @method signup
 * @description remove a comments from specified bugId
 * @type RequestHandler
 */
exports.deleteComment = async (req, res) => {
  try {
    let comment = await Bug.findOneAndUpdate(
      { bugId: req.params.bugId },
      { $pull: { "comments": { _id: req.params.comment_id } } },
      { new: true }
    );
    if (!comment) res.notFound({ error: 'Not found' })

    res.ok(comment);
  } catch (err) {
    res.internalError({
      error: `Something went wrong while deleting comment#${req.params.comment_id}`,
    })
  }
}
