/// <reference path="./mytypes.d.ts" />
const { Bug } = require('../models/bugModel');
const { validateComment } = require('../models/commentModel');
const { Notification } = require('../models/notificationModel');


/**
 * @route GET /api/bugs/:bugId/comments
 * @description GET all comments with a specified bugId
 * @type RequestHandler
 */
exports.getComments = async (req, res) => {
  try {
    const bug = await Bug.findOne({ bugId: req.params.bugId })
    if (!bug) return res.notFound({ error: `Bug#${req.params.bugId} Not Found` })

    res.ok({ data: bug.comments });
  } catch (err) {
    console.log(err)
    res.internalError({
      error: 'Something went wrong while getting comments',
    })
  }
}

/**
 * @route PATCH /api/bugs/:bugId/comments
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
      _id: req.user.id
    };

    bug.comments.push({
      body: value.body,
      author: authorDetails
    });

    let newBug = await bug.save();

    // send notifications
    let notification = new Notification({
      type: 'commented',
      byUser: req.user.id,
      onBug: newBug._id,
      notificationTo: [],
    });
    await notification.save();

    res.ok({ data: newBug.comments });
  } catch (err) {
    res.internalError({
      error: 'Something went wrong while adding new comment',
    })
  }
}

/**
 * @route DELETE /api/bugs/:bugId/comments/:comment_id
 * @description remove a comments from specified bugId
 * @type RequestHandler
 */
exports.deleteComment = async (req, res) => {
  try {
    const bug = await Bug.findOneAndUpdate(
      { bugId: req.params.bugId },
      {
        $pull: {
          "comments": {
            _id: req.params.comment_id,
            'author._id': req.user.id
          }
        }
      },
      { new: true, select: 'comments' }
    )
    if (!bug) return res.notFound({ error: `Bug#${req.params.bugId} Not Found` });

    res.ok({ data: bug.comments });
  } catch (err) {
    res.internalError({
      error: `Something went wrong while deleting comment #${req.params.comment_id}`,
    })
  }
}

/**
 * @route PATCH /api/bugs/:bugId/comments/:comment_id
 * @description update a comments from specified bugId, comment_id
 * @type RequestHandler
 */
exports.updateComment = async (req, res) => {
  const { error, value } = validateComment(req.body);
  if (error) return res.unprocessable({ error: error.details[0].message });

  try {
    const bug = await Bug.findOneAndUpdate(
      {
        bugId: req.params.bugId,
        comments: {
          $elemMatch: {
            '_id': req.params.comment_id,
            'author._id': req.user.id
          }
        }
      },
      {
        $set: {
          'comments.$.body': value.body
        }
      },
      { new: true, runValidators: true, select: 'comments' }
    )
    if (!bug) return res.notFound({ error: `Bug#${req.params.bugId} Not Found` });

    res.ok({ data: bug.comments });
  } catch (err) {
    console.log(err)
    res.internalError({
      error: `Something went wrong while updating comment #${req.params.comment_id}`,
    })
  }
}
