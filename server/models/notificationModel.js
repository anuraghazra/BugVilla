const mongoose = require('mongoose');


// mentioned: byUser, fromBug, [mentions]
// commented: byUser, onBug
// bug_status: byUser, onBug, bug_status
// new_bug: byUser, onBug
// referenced: byUser, fromBug, [references]
const NotificationSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['mentioned', 'commented', 'bug_status', 'new_bug', 'referenced']
  },
  byUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  fromBug: {
    type: mongoose.Types.ObjectId,
    ref: 'Bug'
  },
  onBug: {
    type: mongoose.Types.ObjectId,
    ref: 'Bug'
  },
  bug_status: { type: String, enum: ['opened', 'closed'] },
  references: [{ type: mongoose.Types.ObjectId, ref: 'Bug' }],
  mentions: [{ type: String }],

  notificationTo: [
    {
      type: mongoose.Types.ObjectId,
      ref: 'User'
    }
  ]
}, { timestamps: true })


NotificationSchema.set('toJSON', {
  transform: function (doc, ret, options) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  }
});
// create the model
const Notification = mongoose.model('Notification', NotificationSchema, 'notifications');

module.exports.Notification = Notification;