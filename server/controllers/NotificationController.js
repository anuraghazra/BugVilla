/// <reference path="./mytypes.d.ts" />
const Joi = require('@hapi/joi');
const { User } = require('../models/userModel');
const { Bug } = require('../models/bugModel');
const { Notification } = require('../models/notificationModel');
const { NOTIFY_TYPES } = require('../constants');

/**
 * @route GET /api/notifications
 * @type RequestHandler
 */
exports.getNotifications = async (req, res) => {
  const MAX_ITEMS = 10;
  const page = parseInt(req.query.page - 1);

  const notifications = await Notification.find({})
    .sort({ createdAt: -1 })
    .populate('byUser', 'username')
    .populate('onBug', 'title bugId')
    .populate('fromBug ', 'title bugId')
    .populate('references ', 'title bugId');

  const filtered = notifications.filter(notify => {
    if (notify.type === NOTIFY_TYPES.MENTIONED) {
      return notify.notificationTo.includes(req.user.id);
    } else {
      return notify;
    }
  });

  res.send({
    totalDocs: filtered.length,
    totalPages: Math.floor(filtered.length / MAX_ITEMS),
    data: filtered.slice(MAX_ITEMS * page, MAX_ITEMS * page + MAX_ITEMS),
  });
};

/**
 * @route POST /api/notifications/mentions/:bugId
 * @type RequestHandler
 */
exports.mentionPeople = async (req, res) => {
  const { error, value } = Joi.object({
    mentions: Joi.array().items(Joi.string()).required(),
  }).validate(req.body);

  if (error) {
    return res.unprocessable({ error: error.details[0].message });
  }

  const usersIds = await User.find({
    username: {
      $in: [...value.mentions],
    },
  }).select('_id');

  const bug = await Bug.findOne({ bugId: req.params.bugId });
  if (!bug) return res.notFound({ error: `Bug#${req.params.bugId} Not Found` });

  // send notifications
  const notification = new Notification({
    type: NOTIFY_TYPES.MENTIONED,
    byUser: req.user.id,
    onBug: bug._id,
    mentions: [...value.mentions],
    notificationTo: usersIds.map(v => v._id),
  });
  await notification.save();

  res.ok({ message: notification });
};
