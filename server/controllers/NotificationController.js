/// <reference path="./mytypes.d.ts" />
const Joi = require('@hapi/joi');
const { User } = require('../models/userModel');
const { Bug } = require('../models/bugModel');
const { Notification } = require('../models/notificationModel');


/**
 * @route GET /api/notifications
 * @type RequestHandler
 */
exports.getNotifications = async (req, res) => {
  const notifications = await Notification.find({})
    .populate('byUser', 'username')
    .populate('onBug', 'title bugId')
    .populate('fromBug ', 'title bugId')
    .populate('references ', 'title bugId');

  let filtered = notifications.filter(notify => {
    if (notify.type === 'mentioned') {
      return notify.notificationTo.includes(req.user.id)
    } else {
      return notify;
    }
  })

  res.send({ data: filtered })
}


/**
 * @route POST /api/notifications/mentions/:bugId
 * @type RequestHandler
 */
exports.mentionPeople = async (req, res) => {
  const { error, value } = Joi.object({
    mentions: Joi.array().items(Joi.string()).required()
  }).validate(req.body);

  if (error) {
    return res.unprocessable({ error: error.details[0].message })
  }

  let usersIds = await User.find({
    username: {
      $in: [...value.mentions]
    }
  }).select('_id');

  let bug = await Bug.findOne({ bugId: req.params.bugId });
  if (!bug) return res.notFound({ error: `Bug#${req.params.bugId} Not Found` });

  // send notifications
  let notification = new Notification({
    type: 'mentioned',
    byUser: req.user.id,
    onBug: bug._id,
    mentions: [...value.mentions],
    notificationTo: usersIds.map(v => v._id)
  });
  await notification.save();

  res.ok({ message: notification })
}