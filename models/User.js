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

    userCreated: {
      type: Date,
      default: Date.now
    }
  },
  {
    toJSON: {
      virtuals: true
    },
    id: false
  }
);

// UserSchema.virtual('friendCount').get(function() {
//   return this.friends.length;
// });

const User = model('User', UserSchema);

module.exports = User;