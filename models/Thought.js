const { Schema, model, Types } = require('mongoose');
// Import date utility
const dateFormat = require('../utils/dateFormat');

// Subdocument schema to the Thought model
const ReactionSchema = new Schema(
    {
        reactionId: { 
            type: Schema.Types.ObjectId,
            default: () => new Types.ObjectId()
        },
        reactionBody: { 
            type: String,
            required: 'Please enter text.',
            max: 280
        },
        username: {
            type: String,
            required: 'Please enter your valid username.'
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: createdAtVal => dateFormat(createdAtVal)
        }
    },
    {
        toJSON: {
            getters: true
        },
        _id: false
    }
);

// This is the schema for the Thought model
const ThoughtSchema = new Schema(
    {
        thoughtText: {
            type: String,
            required: 'Please enter text!',
            min: [1, 'Not enough characters!'],
            max: 280
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: createdAtVal => dateFormat(createdAtVal)
        },
        username: {
            type: String,
            required: 'Please enter your valid username.'
        },
        userId: {
            type: String,
            required: true
        },
        reactions: [ReactionSchema]
    },
    {
        toJSON: {
            virtuals: true,
            getters: true
        },
        id: false
    }
);

// This virtual gets the length of the reactions array field on query for a thought
ThoughtSchema.virtual('reactionCount').get(function() {
    return this.reactions.length;
});

const Thought = model('Thought', ThoughtSchema);

module.exports = Thought;