const { Schema, model } = require('mongoose');

const UserSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      trim: true,
      required: 'Please enter a username!'
    },
    email: {
      type: String,
      required: 'Please enter a valid email!',
      unique: true,
      // Confirms input value is a valid email format
      match: [/.+@.+\..+/, 'Please enter a valid e-mail address']
    },
    // References thought model
    thoughts: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Thought'
        }
    ],    
    // References self to add User(s) as friends by _id
    friends: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
  },
  {
    toJSON: {
      // Allows virtuals
      virtuals: true
    },
    id: false
  }
);

// This is a virtual to get the length of the user's friends array field on query
UserSchema.virtual('friendCount').get(function() {
  return this.friends.length;
});

// User model uses UserSchema
const User = model('User', UserSchema);

module.exports = User;