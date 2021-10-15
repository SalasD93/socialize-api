const { Thought, User } = require('../models/entities');

const thoughtController = {
    // Add thought to user account
    addThought({ params, body }, res) {
        Thought.create(body)
        // Thought _id
        .then(({ _id }) => {
            return User.findOneandUpdate(
                { _id: params.userId },
                // Thought _id
                { $push: { thoughts: _id }},
                { new: true }
            );
        })
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({ message: 'User not found!'});
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => res.json(err));
    },

    // Add reaction to thought
    addReaction({ params, body }, res) {
        Thought.findOneAndUpdate(
            { _id: params.thoughtId },
            { $push: { reactions: body }},
            { new: true, runvalidators: true }
        )
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({ message: 'User not found!'});
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => res.json(err));
    },

    // Remove thought
    removeThought({ params }, res) {
        Thought.findOneandDelte({ _id: params.thoughtId})
        .then(deletedThought => {
            if(!deletedThought) {
                return res.status(400).json({ message: 'No thought found!'});
            }
            return User.findOneAndUpdate(
                { _id: params.userId },
                { $pull: { thoughts: params.thoughtId }},
                { new: true }
            );
        })
        .then(dbUserData => {
            if (!dbUserData) {
                res.json({ message: 'No user found!' });
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => res.json(err));
    },

    // Remove reaction
    removeReaction({ params }, res) {
        Thought.findOneAndUpdate(
            { _id: params.thoughtId },
            { $pull: { reactions: { reactionId: params.reactionId }}},
            { new: true }
        )
        .then(dbUserData => res.json(dbUserData))
        .catch(err => res.json(err));
    }
};

module.exports = thoughtController;