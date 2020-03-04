/// <reference path="./mytypes.d.ts" />
const { Bug } = require('../models/bugModel');
const { validateComment } = require('../models/commentModel');
const { Notification } = require('../models/notificationModel');
const { notify_types } = require('../constants');
const Joi = require('@hapi/joi')

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
      type: notify_types.COMMENTED,
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


/**
 * @route PATCH /api/bugs/:bugId/comments/:comment_id/reactions
 * @description PATCH toggle a reaction from specified bugId & reaction name
 * @type RequestHandler
 */
exports.addOrRemoveReaction = async (req, res) => {
  const { error, value } = Joi.object({
    emoji: Joi.string().required()
  }).validate(req.body);
  if (error) {
    return res.unprocessable({ error: error.details[0].message })
  }

  try {
    // preventing _id in LabelSchema fixes the issue to `$addToSet` not working
    let bug = await Bug.findOne({
      bugId: req.params.bugId,
      comments: {
        $elemMatch: {
          '_id': req.params.comment_id,
        }
      }
    })
    if (!bug) return res.notFound({ error: `Bug#${req.params.bugId} Not Found` });
    const userId = req.user.id.toString();
    // find index of the reactions, if its already exist then we will remove
    // the reactions else we will add it.
    // TODO: fix perf issues
    for (let i = 0; i < bug.comments.length; i++) {
      let comment = bug.comments[parseInt(i)];
      if (comment.id !== req.params.comment_id) continue;
      // find the index of matching user & emoji pair
      const index = bug.comments[parseInt(i)].reactions.findIndex((reaction) => {
        const isSameReaction = reaction.emoji === value.emoji
        const isSameId = reaction.users.includes(userId);
        return (isSameId && isSameReaction);
      });

      if (index > -1) {
        // findIndex of user to remove it from the users list
        const indexOfUser = bug.comments[parseInt(i)].reactions[parseInt(index)].users.indexOf(userId)
        bug.comments[parseInt(i)].reactions[parseInt(index)].users.splice(indexOfUser, 1);
        // if users list is empty then remove the entire reaction
        if (bug.comments[parseInt(i)].reactions[parseInt(index)].users.length < 1) {
          bug.comments[parseInt(i)].reactions.splice(index, 1);
        }
      } else {
        const emojiIndex = bug.comments[parseInt(i)].reactions.findIndex(r => r.emoji === value.emoji);
        // if emoji is absent then push it to the reactions list
        // else push the userId to the users list
        emojiIndex === -1
          ? bug.comments[parseInt(i)].reactions.push({ emoji: value.emoji, users: [req.user.id] })
          : bug.comments[parseInt(i)].reactions[parseInt(emojiIndex)].users.push(req.user.id)
      }
    }

    const newBug = await bug.save();
    if (!newBug) return res.notFound({ error: `Bug#${req.params.bugId} Not Found` });

    res.ok({ data: newBug.comments });
  } catch (err) {
    console.log(err)
    res.internalError({
      error: `Something went wrong while adding new reaction`,
    })
  }
}

/**
 * @route GET /api/bugs/:bugId/reactions
 * @description GET get all reactions
 * @type RequestHandler
 */
exports.getReactions = async (req, res) => {
  try {
    // preventing _id in LabelSchema fixes the issue to `$addToSet` not working
    let bug = await Bug.findOne({ bugId: req.params.bugId })
      .select('comments')
      .populate('comments.reactions.user', 'name username')

    res.ok({ data: bug.comments });
  } catch (err) {
    console.log(err)
    res.internalError({
      error: `Something went wrong while adding new reaction`,
    })
  }
}