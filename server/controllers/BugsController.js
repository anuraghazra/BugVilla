/// <reference path="./mytypes.d.ts" />
const { Bug, validateBug, validateLabel } = require('../models/bugModel');

/**
 * @method getBugs
 * @type RequestHandler
 */
exports.getBugs = async (req, res) => {
  try {
    let bugs = await Bug.find({});
    if (!bugs) return res.notFound({ errror: 'Not Found' });

    res.ok(bugs);
  } catch {
    res.internalError({ error: err });
  }
}

/**
 * @method getBugsByNumber
 * @type RequestHandler
 */
exports.getBugByNumber = async (req, res) => {
  try {
    let bug = await Bug.findOne({ bugId: req.params.id });
    if (!bug) return notFound({ error: 'Not Found' });

    res.ok(bug);
  } catch (err) {
    res.internalError({ error: err });
  }
}

/**
 * @method createBug
 * @type RequestHandler
 */
exports.createBug = async (req, res) => {
  const { error, value } = validateBug(req.body);
  if (error) {
    return res.unprocessable({ error: error.details[0].message })
  }

  try {
    let authorDetails = {
      username: req.user.username,
      name: req.user.name,
    }

    let bug = new Bug({ ...value, author: authorDetails });
    const newBug = await bug.save();

    res.created(newBug);
  } catch (err) {
    res.internalError({ error: err });
  }
}

/**
 * @method toggleBugOpenClose
 * @type RequestHandler
 */
exports.toggleBugOpenClose = ({ state }) => {
  return async (req, res) => {
    try {
      // {new: true} tells mongo to return the updated document
      let bug = await Bug.findOneAndUpdate(
        { bugId: req.params.id },
        { isOpen: state },
        { new: true }
      );
      if (!bug) return res.notFound({ error: 'Not Found' });

      res.ok(bug);
    } catch (err) {
      res.internalError({ error: err });
    }
  }
}

/**
 * @method addLabel
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
      { bugId: req.params.id },
      { $addToSet: { labels: value } },
      { new: true }
    );
    if (!bug) return res.notFound({ error: 'Not Found' });

    res.ok(bug);
  } catch (err) {
    res.internalError({ error: err });
  }
}

/**
 * @method deleteLabel
 * @type RequestHandler
 */
exports.deleteLabel = async (req, res) => {
  try {
    let bug = await Bug.findOneAndUpdate(
      { bugId: req.params.id },
      { $pull: { "labels": { name: req.params.name } } },
      { new: true }
    );
    if (!bug) return res.notFound({ error: 'Not Found' });

    res.ok(bug);
  } catch (err) {
    res.internalError({ error: err });
  }
}