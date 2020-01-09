/// <reference path="./mytypes.d.ts" />
const Joi = require('@hapi/joi');
const { Bug, validateBug, validateLabel } = require('../models/bugModel');


/**
 * @route GET /api/bugs/
 * @description Get all bugs
 * @type RequestHandler
 */
exports.getBugs = async (req, res) => {
  try {
    let bugs = await Bug.find({});
    if (!bugs) return res.notFound({ errror: 'Not Found' });

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
        { new: true }
      );
      if (!bug) return res.notFound({ error: `Bug#${req.params.bugId} Not Found` });

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