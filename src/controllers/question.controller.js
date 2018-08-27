import express from 'express';
import { client, findUserById } from './database.controller';
import { verifyToken, generateToken } from './token.controller';


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
router.get('/:questionId', verifyToken, (req, res) => {
  const id = req.params.id;
});

/**
 * Post a question.
 */
router.post('/', verifyToken, (req, res) => {
  /*
  question_id TEXT PRIMARY KEY NOT NULL,
                         category TEXT,
                         title TEXT,
                         content TEXT,
                         preferred_answer_id TEXT,
                         user_id TEXT REFERENCES users(user_id),
                         answer_count INTEGER,
                         created_at TIMESTAMP );`,
   */
  const { category, title, content } = req.body;
  const userId = req.userId;
  findUserById(userId, (err, user) => {
    if (!err) {

    }
  });
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
