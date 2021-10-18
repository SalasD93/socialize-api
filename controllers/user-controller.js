const { User, Thought } = require('../models');

const userController = {
    // Get all users
    getAllUser(req, res) {
        User.find({})
        // Includes the thoughts related to each user
        .populate({
            path: 'thoughts',
            // Omits the version key from results for thoughts
            select: '-__v'
        })
        .populate({
            path: 'friends',
            select: '-__v'
        })
        // Omits the version key from results for user
        .select('-__v')
        // -1 denotes descending order
        // .sort({ _id: -1})
        .then(dbUserData => res.json(dbUserData))
        .catch(err => {
            console.log(err);
            res.sendStatus(400);
        });
    },

    // Get one user by 
    getUserById({ params }, res) {
        User.findOne({ _id: params.id })
        .populate({
            path: 'thoughts',
            select: '-__v'
        })
        .populate({
            path: 'friends',
            select: '-__v'
        })
        .select('-__v')
        .then(dbUserData => res.json(dbUserData))
        .catch(err => {
            console.log(err);
            res.sendStatus(400);
        });
    },

    // CreateUser
    createUser({ body }, res) {
        User.create(body)
        .then(dbUserData => res.json(dbUserData))
        .catch(err => res.json(err));
    },

    // Update user by id
    updateUser({ params, body }, res) {
        // Used new: true to return the document after update applied
        User.findOneAndUpdate({ _id: params.id }, body, { new: true })
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({ message: 'No user found!'})
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => res.json(err));
    },

    // Delete user and associated thoughts
    deleteUser({ params }, res) {
        User.findOneAndDelete({ _id: params.id })
        .then(dbUserData => {
            if(!dbUserData) {
                res.status(404).json({ message: 'No user found! '});
                return;
            };
            return Thought.deleteMany({ userId: params.id });
        })
        .then(data => res.json(data))
        .catch(err => res.json(err));
    },

    // Create friend
    createFriend({ params }, res) {
        User.findOneAndUpdate(
            { _id: params.userId },
            { $addToSet: { friends: params.friendId }},
            { new: true, runValidators: true }
        )
        .select('-__v')
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({ message: 'User not found!' });
                return;
            };
            return res.json(dbUserData);
        })
        .catch(err => res.json(err))
    },

    // Delete friend
    deleteFriend({ params }, res) {
        User.findOneAndUpdate(
            { _id: params.userId },
            { $pull: { friends: params.friendId }},
            { new: true}
        )
        .select('-__v')
        .then(dbUserData => res.json(dbUserData))
        .catch(err => res.json(err))
    }
};

module.exports = userController;