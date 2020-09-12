const mongoose = require('mongoose');

const UserRef = {
  type: mongoose.Schema.Types.ObjectId,
  required: false,
  ref: 'User',
};
const ReactionSchema = new mongoose.Schema(
  {
    users: [UserRef],
    emoji: {
      type: String,
      enum: [':+1:', ':-1:', ':smile:', ':heart:', ':confused:', ':tada:'],
      required: true,
    },
  },
  { _id: false }
);

// {
//   "emoji": ":tada:",
//   "users": [
//     "5e14a6cb2bd1161700e6062e",
//     "5e47e0cfee6f4e17786948a5",
//     "5e47e0cfee6f4e17786948a5"
//   ]
// },
module.exports = ReactionSchema;
