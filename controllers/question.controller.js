import express from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();

/**
 * Get all questions.
 */
router.get('/', (req, res) => {

});

/**
 * Get a question.
 * @param questionId : question id
 */
router.get('/:questionId', (req, res) => {
  const id = req.params.id;

});

/**
 * Post a question.
 */
router.post('/', (req, res) => {

});

/**
 * Delete a question.
 */
router.delete('/:questionId', (req, res) => {

});

/**
 * Post an answer to a question.
 */
router.post('/:questionId/answer', (req, res) => {

});

/**
 * Question poster can mark an answer a preferred.
 */
router.put('/:questionId/answers/:answerId/mark', (req, res) => {

});

/**
 * Upvote or downvote an answer.
 */
router.put('/vote', (req, res) => {

});

/**
 * Comment on an answer.
 */
router.post('/comment', (req, res) => {

});

/**
 * User fetches all questions he/she has ever asked.
 */
router.get('/my-questions', (req, res) => {

});

/**
 * Search for questions on the platform.
 */
router.get('/search', (req, res) => {

});


/**
 * Get all the most answered questions.
 */
router.get('/popular-questions', (req, res) => {

});

module.exports = router;