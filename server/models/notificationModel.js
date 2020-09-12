const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['MENTIONED', 'COMMENTED', 'BUG_STATUS', 'NEW_BUG', 'REFERENCED'],
    },
    byUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    fromBug: {
      type: mongoose.Types.ObjectId,
      ref: 'Bug',
    },
    onBug: {
      type: mongoose.Types.ObjectId,
      ref: 'Bug',
    },
    bug_status: { type: String, enum: ['opened', 'closed'] },
    references: [{ type: mongoose.Types.ObjectId, ref: 'Bug' }],
    mentions: [{ type: String }],

    notificationTo: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  { timestamps: true }
);

NotificationSchema.set('toJSON', {
  transform: function (doc, ret, options) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  },
});
// create the model
const Notification = mongoose.model(
  'Notification',
  NotificationSchema,
  'notifications'
);

module.exports.Notification = Notification;
