const mongoose = require('mongoose');

const TokenSchema = new mongoose.Schema(
  {
    _userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    token: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// create the model
TokenSchema.index(
  { createdAt: 1 },
  {
    expireAfterSeconds: 60 * process.env.EXPIRATION_TIME,
  }
);
const Token = mongoose.model('Token', TokenSchema);

module.exports.Token = Token;
