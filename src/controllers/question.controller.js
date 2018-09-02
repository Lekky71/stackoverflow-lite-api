import express from 'express';
import uuidv4 from 'uuid/v4';
import { check, validationResult } from 'express-validator/check';
import { client, findUserById, verifyUser } from './database.controller';
import { generateToken } from './token.controller';
import queries from '../queries/query';

const router = express.Router();

/**
 * Get all questions.
 */

router.get('/', verifyUser, (req, res) => {
  client.query(queries.get_all_questions, (err, results) => {
    if (err) {
      return res.status(200).json({ status: 'failure', errors: ['an error occurred'] });
    }
    return res.status(200).json({
      status: 'success', errors: null, questions: results.rows, token: generateToken(req.body.userId),
    });
  });
});

/**
 * Get a question.
 * @param questionId : question id
 */
router.get('/:questionId', verifyUser, (req, res) => {
  const { questionId } = req.params;
  client.query(queries.get_question_by_id, [questionId], (err, results) => {
    if (err) {
      return res.status(200).json({ status: 'failure', errors: ['an error occurred'] });
    }
    return res.status(200).json({
      status: 'success', errors: null, questions: results.rows, token: generateToken(req.body.userId),
    });
  });
});

/**
 * Post a question.
 */
router.post('/', verifyUser, [
  check('category').exists().withMessage('Enter category').trim()
    .isLength({ min: 3 })
    .withMessage('Minimum length for category is 3'),
  check('title').exists().withMessage('Enter a title').trim()
    .isLength({ min: 3 })
    .withMessage('Minimum length for category is 3'),
  check('content').exists().withMessage('Enter content').isLength({ min: 5 })
    .withMessage('Minimum length for content is 5'),
], (req, res) => {
  const errors = validationResult(req);
  const errorArray = [];
  errors.array().forEach((err1) => {
    errorArray.push(err1.msg);
  });

  if (!errors.isEmpty()) {
    return res.json({ status: 'failure', errors: errorArray });
  }

  const { userId } = req.body;
  const {
    category, title, content,
  } = req.body;
  const questionId = uuidv4().toString();
  client.query(queries.add_question, [questionId, category, title, content,
    userId, 0, new Date()], (err1, results1) => {
    if (err1) {
      return res.status(200).json({ status: 'failure', errors: ['an error occurred'] });
    }
    return res.status(200).json({
      status: 'success', errors: null, question: results1.rows[0], token: generateToken(userId),
    });
  });
});

/**
 * Delete a question.
 */
router.delete('/:questionId', verifyUser, (req, res) => {
  const { questionId } = req.params;
  const { userId } = req.body;
  client.query(queries.delete_question_by_id, [questionId], (err1, results1) => {
    if (err1) {
      return res.status(200).json({ status: 'failure', errors: ['an error occurred'] });
    }
    return res.status(200).json({
      status: 'success', errors: null, rows_deleted: results1.rowCount, token: generateToken(userId),
    });
  });
});

/**
 * Post an answer to a question.
 */
router.post('/:questionId/answer', [
  check('content').exists().withMessage('Enter content').trim()
    .isLength({ min: 20 })
    .withMessage('Minimum length for content is 20'),
], (req, res) => {
  const errors = validationResult(req);
  const errorArray = [];
  errors.array().forEach((err1) => {
    errorArray.push(err1.msg);
  });

  if (!errors.isEmpty()) {
    return res.json({ status: 'failure', errors: errorArray });
  }
  const { content, userId } = req.body;
  const { questionId } = req.params;
  const answerId = uuidv4().toString();
  client.query(queries.add_answer, [answerId, questionId, content,
    userId, 0, 0, new Date()], (err1, results1) => {
    if (err1) {
      return res.status(200).json({ status: 'failure', errors: ['an error occurred'] });
    }
    return res.status(200).json({
      status: 'success', errors: null, answer: results1.rows[0], token: generateToken(userId),
    });
  });
});

/**
 * Question poster can mark an answer a preferred.
 */
router.put('/:questionId/answers/:answerId/mark', verifyUser, (req, res) => {
  const { userId } = req.body;
  const { questionId, answerId } = req.params;
  client.query(queries.mark_answer_as_preferred, [answerId, questionId],
    (err1, results1) => {
      if (err1) {
        return res.status(200).json({ status: 'failure', errors: ['an error occurred'] });
      }
      return res.status(200).json({
        status: 'success', errors: null, answer: results1.rows[0], token: generateToken(userId),
      });
    });
});

/**
 * Upvote or downvote an answer.
 */
router.put('/:questionId/answers/:answerId/vote', [
  check('vote').exists().withMessage('enter vote'),
], verifyUser, (req, res) => {
  const errors = validationResult(req);
  const errorArray = [];
  errors.array().forEach((err1) => {
    errorArray.push(err1.msg);
  });

  if (!errors.isEmpty()) {
    return res.json({ status: 'failure', errors: errorArray });
  }

});

/**
 * Comment on an answer.
 */
router.post('/comment', verifyUser, (req, res) => {

});

/**
 * User fetches all questions he/she has ever asked.
 */
router.get('/my-questions', verifyUser, (req, res) => {

});

/**
 * Search for questions on the platform.
 */
router.get('/search', verifyUser, (req, res) => {

});


/**
 * Get all the most answered questions.
 */
router.get('/popular-questions', (req, res) => {

});

module.exports = router;
