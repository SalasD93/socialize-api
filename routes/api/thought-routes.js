const router = require('express').Router();

const {
  getAllThoughts,
  getThoughtById,
  addThought,
  updateThought,
  addReaction,
  removeThought,
  removeOnlyThought,
  removeReaction
} = require('../../controllers/thought-controller');

// /api/thoughts
router
  .route('/')
  .get(getAllThoughts);

// /api/thoughts/:userId
router
  .route('/:userId')
  .post(addThought);

// /api/thoughts/:userId/:thoughtId
router
  .route('/:userId/:thoughtId')
  .get(getThoughtById)
  .put(updateThought)
  .delete(removeThought);

// Remove thought not associated with user
// /api/thoughts/:thoughtId
router
.route('/:thoughtId')
.delete(removeOnlyThought);

// /api/thoughts/:userId/:thoughtId/reactions
router
  .route('/:userId/:thoughtId/reactions')
  .put(addReaction);

// /api/thoughts/<userId>/<thoughtId>/<reactionId>
router
  .route('/:userId/:thoughtId/:reactionId')
  .delete(removeReaction);

module.exports = router;