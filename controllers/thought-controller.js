const { Thought, User } = require('../models');

const thoughtController = {
    // Get all thoughts
    getAllThoughts(req, res) {
        Thought.find({})
            .select('-__v')
            .then(dbThoughtData => res.json(dbThoughtData))
            .catch(err => {
                console.log(err);
                return res.status(400).json(err);
            });
    },

    // Get thought by _id
    getThoughtById({ params }, res) {
        Thought.findOne({ _id: params.thoughtId })
            .select('-__v')
            .then(dbThoughtData => {
                if (!dbThoughtData) {
                    res.status(404).json({ message: 'No thought found!' });
                }
                return res.json(dbThoughtData);
            })
            .catch(err => {
                console.log(err);
                return res.status(400).json(err);
            })
    },

    // Add thought to user account
    addThought({ params, body }, res) {
        Thought.create({
            thoughtText: body.thoughtText,
            username: body.username,
            userId: params.userId
        })
        // Thought _id
        .then(({ _id }) => {
            return User.findOneAndUpdate(
                { _id: params.userId },
                // Thought _id
                { $addToSet: { thoughts: _id }},
                { new: true }
            );
        })
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({ message: 'User not found!'});
                return;
            }
            return res.json(dbUserData);
        })
        .catch(err => res.json(err));
    },

    // Update thought
    updateThought({ params, body }, res) {
        Thought.findOneAndUpdate(
            { _id: params.thoughtId },
            body,
            { new: true }
        )
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json('No thought found!');
                return;
            }
            return res.json(dbUserData);
        })
        .catch(err => res.json(err));
    },



    // Add reaction to thought
    addReaction({ params, body }, res) {
        Thought.findOneAndUpdate(
            { _id: params.thoughtId },
            { $addToSet: { reactions: body }},
            { new: true, runvalidators: true }
        )
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({ message: 'User not found!'});
                return;
            }
            return res.json(dbUserData);
        })
        .catch(err => res.json(err));
    },

    // Remove thought
    removeThought({ params }, res) {
        Thought.findOneAndDelete({ _id: params.thoughtId})
            .then(deletedThought => {
                if(!deletedThought) {
                    return res.status(404).json({ message: 'No thought found!'});
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
                return res.json(dbUserData);
            })
            .catch(err => res.json(err));
    },

    // Remove thought without user
    removeOnlyThought({ params }, res) {
        Thought.findOneAndDelete({ _id: params.thoughtId })
            .then(deletedThought => res.json(deletedThought))
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