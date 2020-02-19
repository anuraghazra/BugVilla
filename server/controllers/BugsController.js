/// <reference path="./mytypes.d.ts" />
const Joi = require('@hapi/joi');
const { Bug, validateBug, validateLabel, validateReferences } = require('../models/bugModel');
const { Notification } = require('../models/notificationModel')

/**
 * @route GET /api/bugs/
 * @description Get all bugs
 * @type RequestHandler
 */
exports.getBugs = async (req, res) => {
  try {
    let bugs = await Bug.find({});
    if (!bugs) return res.notFound({ error: 'Not Found' });

    res.ok({ data: bugs });
  } catch (err) {
    res.internalError({
      error: `Something went wrong while getting bugs`,
    })
  }
}

/**
 * @route GET /api/bugs/suggestions
 * @description Get all bugs suggestions, only returns bugId and title
 * @type RequestHandler
 */
exports.getSuggestions = async (req, res) => {
  try {
    let bugs = await Bug.find({}).select('bugId title');
    if (!bugs) return res.notFound({ error: 'Not Found' });

    res.ok({ data: bugs });
  } catch (err) {
    res.internalError({
      error: `Something went wrong while getting bugs`,
    })
  }
}

/**
 * @route GET /api/bugs/:bugId
 * @description Get bug by bugId
 * @type RequestHandler
 */
exports.getBugByNumber = async (req, res) => {
  try {
    let bug = await Bug.findOne({ bugId: req.params.bugId });
    if (!bug) return res.notFound({ error: `Bug#${req.params.bugId} Not Found` });

    res.ok({ data: bug });
  } catch (err) {
    res.internalError({
      error: `Something went wrong while getting bug#${req.params.bugId}`,
    })
  }
}

/**
 * @route POST /api/bugs/
 * @description Create new bug
 * @type RequestHandler
 */
exports.createBug = async (req, res) => {
  const { error, value } = validateBug(req.body);
  if (error) {
    return res.unprocessable({ error: error.details[0].message })
  }

  try {
    /*
      explicitly setting `_id` otherwise mongo will set the `_id` to 
      a random `_id` instead of the original `user._id`, which we need
      because it has to be same so we can check for bug's author
    */
    let authorDetails = {
      _id: req.user.id,
      username: req.user.username,
      name: req.user.name,
    }

    // eslint-disable-next-line node/no-unsupported-features/es-syntax
    let bug = new Bug({ ...value, author: authorDetails });
    const newBug = await bug.save();

    // send notifications
    let notification = new Notification({
      type: 'new_bug',
      byUser: req.user.id,
      onBug: newBug._id,
      notificationTo: [],
    });
    await notification.save();

    res.created({ data: newBug });
  } catch (err) {
    res.internalError({
      error: `Something went wrong while creating new bug`,
    })
  }
}


/**
 * @route PATCH /api/bugs/:bugId
 * @description Update a bug with specified bugId
 * @type RequestHandler
 */
exports.updateBug = async (req, res) => {
  try {
    let schema = Joi.object({
      title: Joi.string().min(6).max(100),
      body: Joi.string().min(6).max(10000),
    })
    let { error, value } = schema.validate(req.body);
    if (error) {
      return res.unprocessable({ error: error.details[0].message })
    }
    return res.notFound({ error: 'error' })

    let bug = await Bug.findOneAndUpdate(
      {
        bugId: req.params.bugId,
        // also check if current user is the author of this bug
        "author._id": { $eq: req.user.id }
      },
      value,
      { new: true } // tells mongo to return the updated document
    );
    if (!bug) return res.notFound({ error: `Can not update Bug#${req.params.bugId}` });

    res.ok({ data: bug });
  } catch (err) {
    console.error(err)
    res.internalError({
      error: `Something went wrong while updating bug`,
    })
  }
}

/**
 * @route PATCH /api/bugs/:bugId/[close|open]
 * @description Helper function to close/open bug and pushes to activities array
 * @type RequestHandler
 */
exports.toggleBugOpenClose = ({ state }) => {
  return async (req, res) => {
    try {
      // {new: true} tells mongo to return the updated document
      let bug = await Bug.findOneAndUpdate(
        { bugId: req.params.bugId, isOpen: !state },
        {
          $push: {
            activities: {
              author: req.user,
              action: state ? 'opened' : 'closed'
            }
          },
          isOpen: state,
        },
        { new: true, runValidators: true }
      );
      if (!bug) return res.notFound({ error: `Bug#${req.params.bugId} Not Found` });

      // send notifications
      let notification = new Notification({
        type: 'bug_status',
        byUser: req.user.id,
        onBug: bug._id,
        bug_status: state ? 'opened' : 'closed',
        notificationTo: [],
      });
      await notification.save();

      res.ok({ data: bug.activities });
    } catch (err) {
      res.internalError({
        error: `Something went wrong`,
      })
    }
  }
}

/**
 * @route PATCH /api/bugs/:bugId/labels
 * @description Updates thw whole label array
 * @type RequestHandler
 */
exports.updateLabels = async (req, res) => {
  const { error, value } = validateLabel(req.body.labels);
  if (error) {
    return res.unprocessable({ error: error.details[0].message })
  }

  try {
    let bug = await Bug.findOneAndUpdate(
      { bugId: req.params.bugId },
      { $set: { labels: value } },
      { new: true, runValidators: true, }
    );
    if (!bug) return res.notFound({ error: `Bug#${req.params.bugId} Not Found` });

    res.ok({ data: bug.labels });
  } catch (err) {
    res.internalError({
      error: `Something went wrong while updating labels`,
    })
  }
}

/**
 * @route PATCH /api/bugs/:bugId/references
 * @description Adds references to bug
 * @type RequestHandler
 */
exports.addReferences = async (req, res) => {
  const { error, value } = validateReferences(req.body);
  if (error) {
    return res.unprocessable({ error: error.details[0].message })
  }

  try {
    let authorDetails = {
      _id: req.user.id,
      username: req.user.username,
      name: req.user.name,
    }
    let updated = await Bug.updateMany(
      { bugId: { $in: value.references } },
      {
        $push: {
          references: {
            by: authorDetails,
            from: req.params.bugId
          }
        }
      },
      {
        new: true, runValidators: true,
      }
    )
    if (!updated) return res.notFound({ error: `Bug#${req.params.bugId} Not Found` });

    // get the _id for the param.bugId to use it in Notification ref
    let bug = await Bug.findOne({ bugId: req.params.bugId });
    // get all `_id`s for `notification.references` 
    let referencedIds = await Bug.find({
      bugId: {
        $in: [...value.references]
      }
    }).select('_id');
    // send notifications
    let notification = new Notification({
      type: 'referenced',
      byUser: req.user.id,
      fromBug: bug._id,
      references: referencedIds.map(v => v._id),
      notificationTo: [],
    });
    await notification.save();

    res.ok({ data: { modified: updated.nModified } });
  } catch (err) {
    console.log(err)
    res.internalError({
      error: `Something went wrong while referencing bug`,
    })
  }
}

/**
 * @route PATCH /api/bugs/:bugId/labels
 * @description Add a label to specified bugId
 * @type RequestHandler
 */
exports.addLabel = async (req, res) => {
  const { error, value } = validateLabel(req.body);
  if (error) {
    return res.unprocessable({ error: error.details[0].message })
  }

  try {
    // preventing _id in LabelSchema fixes the issue to `$addToSet` not working
    let bug = await Bug.findOneAndUpdate(
      { bugId: req.params.bugId },
      { $addToSet: { labels: value } },
      { new: true }
    );
    if (!bug) return res.notFound({ error: `Bug#${req.params.bugId} Not Found` });

    res.ok({ data: bug });
  } catch (err) {
    res.internalError({
      error: `Something went wrong while adding new label`,
    })
  }
}

/**
 * @route DELETE /api/bugs/:bugId/labels/:name
 * @description Delete a label from specified bugId & label name
 * @type RequestHandler
 */
exports.deleteLabel = async (req, res) => {
  try {
    let bug = await Bug.findOneAndUpdate(
      { bugId: req.params.bugId },
      { $pull: { "labels": { name: req.params.name } } },
      { new: true }
    );
    if (!bug) return res.notFound({ error: `Bug#${req.params.bugId} Not Found` });

    res.ok({ data: bug });
  } catch (err) {
    res.internalError({
      error: `Something went wrong while deleting label`,
    })
  }
}