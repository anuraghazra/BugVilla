/// <reference path="./mytypes.d.ts" />
const Joi = require('@hapi/joi');
const {
  Bug,
  validateBug,
  validateLabel,
  validateReferences,
} = require('../models/bugModel');
const { Notification } = require('../models/notificationModel');
const { NOTIFY_TYPES } = require('../constants');

/**
 * @route GET /api/bugs/
 * @description Get all bugs
 * @type RequestHandler
 */
exports.getBugs = async (req, res) => {
  try {
    const bugs = await Bug.find({});
    if (!bugs) return res.notFound({ error: 'Not Found' });

    res.ok({ data: bugs });
  } catch (err) {
    res.internalError({
      error: 'Something went wrong while getting bugs',
    });
  }
};

/**
 * @route GET /api/bugs/suggestions
 * @description Get all bugs suggestions, only returns bugId and title
 * @type RequestHandler
 */
exports.getSuggestions = async (req, res) => {
  try {
    const bugs = await Bug.find({}).select('bugId title');
    if (!bugs) return res.notFound({ error: 'Not Found' });

    res.ok({ data: bugs });
  } catch (err) {
    res.internalError({
      error: 'Something went wrong while getting bugs',
    });
  }
};

/**
 * @route GET /api/bugs/:bugId
 * @description Get bug by bugId
 * @type RequestHandler
 */
exports.getBugByNumber = async (req, res) => {
  try {
    const bug = await Bug.findOne({ bugId: req.params.bugId })
      .populate('reactions.users', 'name username')
      .populate('comments.reactions.users', 'name username');
    if (!bug)
      return res.notFound({ error: `Bug#${req.params.bugId} Not Found` });

    res.ok({ data: bug });
  } catch (err) {
    res.internalError({
      error: `Something went wrong while getting bug#${req.params.bugId}`,
    });
  }
};

/**
 * @route POST /api/bugs/
 * @description Create new bug
 * @type RequestHandler
 */
exports.createBug = async (req, res) => {
  const { error, value } = validateBug(req.body);
  if (error) {
    return res.unprocessable({ error: error.details[0].message });
  }

  try {
    /*
      explicitly setting `_id` otherwise mongo will set the `_id` to 
      a random `_id` instead of the original `user._id`, which we need
      because it has to be same so we can check for bug's author
    */
    const authorDetails = {
      _id: req.user.id,
      username: req.user.username,
      name: req.user.name,
    };

    // eslint-disable-next-line node/no-unsupported-features/es-syntax
    const bug = new Bug({ ...value, author: authorDetails });
    const newBug = await bug.save();

    // send notifications
    const notification = new Notification({
      type: NOTIFY_TYPES.NEW_BUG,
      byUser: req.user.id,
      onBug: newBug._id,
      notificationTo: [],
    });
    await notification.save();

    res.created({ data: newBug });
  } catch (err) {
    res.internalError({
      error: 'Something went wrong while creating new bug',
    });
  }
};

/**
 * @route PATCH /api/bugs/:bugId
 * @description Update a bug with specified bugId
 * @type RequestHandler
 */
exports.updateBug = async (req, res) => {
  try {
    const schema = Joi.object({
      title: Joi.string().min(6).max(100),
      body: Joi.string().min(6).max(10000),
    });
    const { error, value } = schema.validate(req.body);
    if (error) {
      return res.unprocessable({ error: error.details[0].message });
    }

    const bug = await Bug.findOneAndUpdate(
      {
        bugId: req.params.bugId,
        // also check if current user is the author of this bug
        'author._id': { $eq: req.user.id },
      },
      value,
      { new: true } // tells mongo to return the updated document
    );
    if (!bug)
      return res.notFound({ error: `Can not update Bug#${req.params.bugId}` });

    res.ok({ data: bug.body });
  } catch (err) {
    console.error(err);
    res.internalError({
      error: 'Something went wrong while updating bug',
    });
  }
};

/**
 * @route PATCH /api/bugs/:bugId/[close|open]
 * @description Helper function to close/open bug and pushes to activities array
 * @type RequestHandler
 */
exports.toggleBugOpenClose = ({ state }) => {
  return async (req, res) => {
    try {
      // {new: true} tells mongo to return the updated document
      const bug = await Bug.findOneAndUpdate(
        { bugId: req.params.bugId, isOpen: !state },
        {
          $push: {
            activities: {
              author: req.user,
              action: state ? 'opened' : 'closed',
            },
          },
          isOpen: state,
        },
        { new: true, runValidators: true }
      );
      if (!bug)
        return res.notFound({ error: `Bug#${req.params.bugId} Not Found` });

      // send notifications
      const notification = new Notification({
        type: NOTIFY_TYPES.BUG_STATUS,
        byUser: req.user.id,
        onBug: bug._id,
        bug_status: state ? 'opened' : 'closed',
        notificationTo: [],
      });
      await notification.save();

      res.ok({ data: bug.activities });
    } catch (err) {
      res.internalError({
        error: 'Something went wrong',
      });
    }
  };
};

/**
 * @route PATCH /api/bugs/:bugId/labels
 * @description Updates thw whole label array
 * @type RequestHandler
 */
exports.updateLabels = async (req, res) => {
  const { error, value } = validateLabel(req.body.labels);
  if (error) {
    return res.unprocessable({ error: error.details[0].message });
  }

  try {
    const bug = await Bug.findOneAndUpdate(
      { bugId: req.params.bugId },
      { $set: { labels: value } },
      { new: true, runValidators: true }
    );
    if (!bug)
      return res.notFound({ error: `Bug#${req.params.bugId} Not Found` });

    res.ok({ data: bug.labels });
  } catch (err) {
    res.internalError({
      error: 'Something went wrong while updating labels',
    });
  }
};

/**
 * @route PATCH /api/bugs/:bugId/references
 * @description Adds references to bug
 * @type RequestHandler
 */
exports.addReferences = async (req, res) => {
  const { error, value } = validateReferences(req.body);
  if (error) {
    return res.unprocessable({ error: error.details[0].message });
  }

  try {
    const authorDetails = {
      _id: req.user.id,
      username: req.user.username,
      name: req.user.name,
    };
    const updated = await Bug.updateMany(
      { bugId: { $in: value.references } },
      {
        $push: {
          references: {
            by: authorDetails,
            from: req.params.bugId,
          },
        },
      },
      {
        new: true,
        runValidators: true,
      }
    );
    if (!updated)
      return res.notFound({ error: `Bug#${req.params.bugId} Not Found` });

    // get the _id for the param.bugId to use it in Notification ref
    const bug = await Bug.findOne({ bugId: req.params.bugId });
    // get all `_id`s for `notification.references`
    const referencedIds = await Bug.find({
      bugId: {
        $in: [...value.references],
      },
    }).select('_id');
    // send notifications
    const notification = new Notification({
      type: NOTIFY_TYPES.REFERENCED,
      byUser: req.user.id,
      fromBug: bug._id,
      references: referencedIds.map(v => v._id),
      notificationTo: [],
    });
    await notification.save();

    res.ok({ data: { modified: updated.nModified } });
  } catch (err) {
    console.log(err);
    res.internalError({
      error: 'Something went wrong while referencing bug',
    });
  }
};

/**
 * @route PATCH /api/bugs/:bugId/labels
 * @description Add a label to specified bugId
 * @type RequestHandler
 */
exports.addLabel = async (req, res) => {
  const { error, value } = validateLabel(req.body);
  if (error) {
    return res.unprocessable({ error: error.details[0].message });
  }

  try {
    // preventing _id in LabelSchema fixes the issue to `$addToSet` not working
    const bug = await Bug.findOneAndUpdate(
      { bugId: req.params.bugId },
      { $addToSet: { labels: value } },
      { new: true }
    );
    if (!bug)
      return res.notFound({ error: `Bug#${req.params.bugId} Not Found` });

    res.ok({ data: bug });
  } catch (err) {
    res.internalError({
      error: 'Something went wrong while adding new label',
    });
  }
};

/**
 * @route DELETE /api/bugs/:bugId/labels/:name
 * @description Delete a label from specified bugId & label name
 * @type RequestHandler
 */
exports.deleteLabel = async (req, res) => {
  try {
    const bug = await Bug.findOneAndUpdate(
      { bugId: req.params.bugId },
      { $pull: { labels: { name: req.params.name } } },
      { new: true }
    );
    if (!bug)
      return res.notFound({ error: `Bug#${req.params.bugId} Not Found` });

    res.ok({ data: bug });
  } catch (err) {
    res.internalError({
      error: 'Something went wrong while deleting label',
    });
  }
};

/**
 * @route PATCH /api/bugs/:bugId/reactions
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
    const bug = await Bug.findOne({ bugId: req.params.bugId });

    const userId = req.user.id.toString();
    // find the index of matching user & emoji pair
    const index = bug.reactions.findIndex(reaction => {
      const isSameReaction = reaction.emoji === value.emoji;
      const isSameId = reaction.users.includes(userId);
      return isSameId && isSameReaction;
    });
    const reactions = bug.reactions[parseInt(index)];

    if (index > -1) {
      // findIndex of user to remove it from the users list
      const indexOfUser = reactions.users.indexOf(userId);
      reactions.users.splice(indexOfUser, 1);
      // if users list is empty then remove the entire reaction
      if (reactions.users.length < 1) {
        bug.reactions.splice(index, 1);
      }
    } else {
      const emojiIndex = bug.reactions.findIndex(r => r.emoji === value.emoji);
      // if emoji is absent then push it to the reactions list
      // else push the userId to the users list
      emojiIndex === -1
        ? bug.reactions.push({ emoji: value.emoji, users: [req.user.id] })
        : bug.reactions[parseInt(emojiIndex)].users.push(req.user.id);
    }

    const newBug = await bug
      .save()
      .then(t => t.populate('reactions.users', 'name username').execPopulate());
    if (!newBug)
      return res.notFound({ error: `Bug#${req.params.bugId} Not Found` });

    res.ok({ data: newBug.reactions });
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
    // preventing _id in LabelSchema fixes the issue to `$addToSet` not working
    const bug = await Bug.findOne({ bugId: req.params.bugId })
      .select('reactions')
      .populate('reactions.user', 'name username');

    res.ok({ data: bug.reactions });
  } catch (err) {
    console.log(err);
    res.internalError({
      error: 'Something went wrong while adding new reaction',
    });
  }
};

/**
 * @unused
 * @route GET /api/bugs/:bugId/reactions/byuser
 * @description GET get all reactions and group them by userids
 * (this function is not in use)
 * @type RequestHandler
 */
exports.getReactionsByUsers = async (req, res) => {
  try {
    // preventing _id in LabelSchema fixes the issue to `$addToSet` not working
    const data = await Bug.aggregate([
      { $match: { 'comments.author.username': req.params.username } },
      { $unwind: '$comments' },
      { $match: { 'comments.author.username': req.params.username } },
      { $project: { reactions: '$comments.reactions' } },
      { $unwind: '$reactions' },

      {
        $group: {
          _id: '$reactions.emoji',
          emojis: { $push: '$reactions.user' },
        },
      },
    ]);

    res.ok({ data: data });
  } catch (err) {
    console.log(err);
    res.internalError({
      error: 'Something went wrong',
    });
  }
};

/**
 * @deprecated
 * @route GET /api/bugs/:bugId/timeline
 * @description GET timeline api
 * @type RequestHandler
 */
exports.getTimeline = async (req, res) => {
  // https://stackoverflow.com/a/41878683/10629172
  // https://stackoverflow.com/q/25497150/10629172
  try {
    const data = await Bug.aggregate([
      // needs to be a number otherwise it wont check
      { $match: { bugId: +req.params.bugId } },
      // concat the arrays
      {
        $project: {
          timeline: { $concatArrays: ['$activities', '$references'] },
        },
      },
      // unwind the timeline array
      {
        $unwind: '$timeline',
      },
      // sort by date
      {
        $sort: { 'timeline.date': 1 },
      },
      {
        $project: {
          // determine if its a reference or an bug_status
          type: {
            $cond: {
              if: { $ifNull: ['$timeline.by', false] },
              then: 'referenced',
              else: 'bug_status',
            },
          },
          action: '$timeline.action',
          date: '$timeline.date',
          from: '$timeline.from',
          author: {
            $cond: {
              if: { $ifNull: ['$timeline.by', false] },
              then: {
                id: '$timeline.by._id',
                username: '$timeline.by.username',
                name: '$timeline.by.name',
              },
              else: {
                id: '$timeline.author._id',
                username: '$timeline.author.username',
                name: '$timeline.author.name',
              },
            },
          },
          // author: {
          //   id: '$timeline.author._id',
          //   username: '$timeline.author.username',
          //   name: '$timeline.author.name'
          // },
          id: '$_id',
          _id: 0,
        },
      },
      // {
      //   $group: {
      //     _id: "$_id",
      //     author: { $first: 1 },
      //     action: { $first: 1 },
      //     date: { $first: 1 },
      //     by: { $first: 1 },
      //     from: { $first: 1 },
      //     timeline: { $push: "$timeline" }
      //   }
      // }
    ]);

    res.ok({ data: data });
  } catch (err) {
    console.log(err);
    res.internalError({
      error: 'Something went wrong while getting timeline data',
    });
  }
};
