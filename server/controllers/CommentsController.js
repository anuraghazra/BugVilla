/// <reference path="./mytypes.d.ts" />
const { Bug } = require('../models/bugModel');
const { validateComment } = require('../models/commentModel');
const { Notification } = require('../models/notificationModel');
const { NOTIFY_TYPES } = require('../constants');
const Joi = require('@hapi/joi');

/**
 * @route GET /api/bugs/:bugId/comments
 * @description GET all comments with a specified bugId
 * @type RequestHandler
 */
exports.getComments = async (req, res) => {
  try {
    const bug = await Bug.findOne({ bugId: req.params.bugId });
    if (!bug)
      return res.notFound({ error: `Bug#${req.params.bugId} Not Found` });

    res.ok({ data: bug.comments });
  } catch (err) {
    console.log(err);
    res.internalError({
      error: 'Something went wrong while getting comments',
    });
  }
};

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
    if (!bug)
      return res.notFound({ error: `Bug#${req.params.bugId} Not Found` });

    const authorDetails = {
      username: req.user.username,
      name: req.user.name,
      _id: req.user.id,
    };

    bug.comments.push({
      body: value.body,
      author: authorDetails,
    });

    const newBug = await bug.save();

    // send notifications
    const notification = new Notification({
      type: NOTIFY_TYPES.COMMENTED,
      byUser: req.user.id,
      onBug: newBug._id,
      notificationTo: [],
    });
    await notification.save();

    res.ok({ data: newBug.comments[newBug.comments.length - 1] });
  } catch (err) {
    res.internalError({
      error: 'Something went wrong while adding new comment',
    });
  }
};

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
          comments: {
            _id: req.params.comment_id,
            'author._id': req.user.id,
          },
        },
      },
      { new: true, select: 'comments' }
    );
    if (!bug)
      return res.notFound({ error: `Bug#${req.params.bugId} Not Found` });

    res.ok({ data: bug.comments });
  } catch (err) {
    res.internalError({
      error: `Something went wrong while deleting comment #${req.params.comment_id}`,
    });
  }
};

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
            _id: req.params.comment_id,
            'author._id': req.user.id,
          },
        },
      },
      {
        $set: {
          'comments.$.body': value.body,
        },
      },
      { new: true, runValidators: true }
    );

    if (!bug)
      return res.notFound({ error: `Bug#${req.params.bugId} Not Found` });

    res.ok({
      data: bug.comments.filter(e => e.id === req.params.comment_id)[0],
    });
  } catch (err) {
    console.log(err);
    res.internalError({
      error: `Something went wrong while updating comment #${req.params.comment_id}`,
    });
  }
};

/**
 * @route PATCH /api/bugs/:bugId/comments/:comment_id/reactions
 * @description PATCH toggle a reaction from specified bugId & reaction name
 * @type RequestHandler
 */
exports.addOrRemoveReaction = async (req, res) => {
  const { error, value } = Joi.object({
    emoji: Joi.string().required(),
  }).validate(req.body);

  if (error) {
    return res.unprocessable({ error: error.details[0].message });
  }

  try {
    // preventing _id in LabelSchema fixes the issue to `$addToSet` not working
    const bug = await Bug.findOne({
      bugId: req.params.bugId,
      'comments._id': req.params.comment_id,
    });
    if (!bug)
      return res.notFound({ error: `Bug#${req.params.bugId} Not Found` });

    // TODO: fix perf issues
    const userId = req.user.id.toString();
    const comments = bug.comments;
    const commentIndex = parseInt(
      comments.findIndex(c => c.id === req.params.comment_id)
    );
    const comment = comments[parseInt(commentIndex)];

    // find the index of matching user & emoji pair
    const index = comment.reactions.findIndex(reaction => {
      const isSameReaction = reaction.emoji === value.emoji;
      const isSameId = reaction.users.includes(userId);
      return isSameId && isSameReaction;
    });

    if (index > -1) {
      // findIndex of user to remove it from the users list
      const indexedComment = comment.reactions[parseInt(index)];
      const indexOfUser = indexedComment.users.indexOf(userId);
      indexedComment.users.splice(indexOfUser, 1);
      // if users list is empty then remove the entire reaction
      if (indexedComment.users.length < 1) {
        comment.reactions.splice(index, 1);
      }
    } else {
      const emojiIndex = comment.reactions.findIndex(
        r => r.emoji === value.emoji
      );
      // if emoji is absent then push it to the reactions list
      // else push the userId to the users list
      emojiIndex === -1
        ? comment.reactions.push({ emoji: value.emoji, users: [req.user.id] })
        : comment.reactions[parseInt(emojiIndex)].users.push(req.user.id);
    }

    const newBug = await bug
      .save()
      .then(t =>
        t.populate('comments.reactions.users', 'name username').execPopulate()
      );
    if (!newBug)
      return res.notFound({ error: `Bug#${req.params.bugId} Not Found` });

    res.ok({
      data: newBug.comments.filter(e => e.id === req.params.comment_id)[0],
    });
  } catch (err) {
    console.log(err);
    res.internalError({
      error: 'Something went wrong while adding new reaction',
    });
  }
};

/**
 * @route GET /api/bugs/:bugId/reactions
 * @description GET get all reactions
 * @type RequestHandler
 */
exports.getReactions = async (req, res) => {
  try {
    // https://stackoverflow.com/a/41354060/10629172
    const bug = await Bug.findOne(
      {
        bugId: req.params.bugId,
        'comments._id': req.params.comment_id,
      },
      { 'comments.$': 1 }
    )
      .select('comments.reactions')
      .populate('comments.reactions.users', 'name username');

    res.ok({ data: bug });
  } catch (err) {
    console.log(err);
    res.internalError({
      error: 'Something went wrong while adding new reaction',
    });
  }
};
