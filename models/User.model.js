const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const authorSchema = new Schema(
  {
    // unless you are defining more than the "type" property, you don't have to use {} (see below)
    // firstName: {type: String, require: true}
    username: {
      type: String,
      trim: true,
      require: [true, 'Username must be unique'],
      unique: true
    },
    passwordHash: {
      type: String
    },
    email: {
      type: String,
      require: [true, 'Email must be unique'],
      unique: true
    }
  },
  {
    // keeps record when is created and updated
    timestamps: true
  }
);

// const Author = model('Author', authorSchema);
// module.exports = Author;

module.exports = model('User', authorSchema);
