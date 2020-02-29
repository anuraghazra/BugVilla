const mongoose = require('mongoose')

const UserRef = {
  type: mongoose.Schema.Types.ObjectId,
  required: false,
  ref: 'User'
}
const ReactionSchema = new mongoose.Schema({
  user: UserRef,
  emoji: {
    type: String,
    enum: [':+1:', ':-1:', ':smile:', ':heart:', ':confused:', ':tada:'],
    required: true
  },
}, { _id: false })

module.exports = ReactionSchema;
