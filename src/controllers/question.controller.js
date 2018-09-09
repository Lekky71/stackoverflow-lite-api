/* eslint-disable consistent-return */
import express from 'express';
import uuidv4 from 'uuid/v4';
import { check, validationResult } from 'express-validator/check';
import { client, verifyUser } from './database.controller';
import { generateToken } from './token.controller';
import queries from '../queries/query';

const router = express.Router();

const validateRoute = (req, res, next) => {
  const errors = validationResult(req);
  const errorArray = [];
  errors.array().forEach((err1) => {
    errorArray.push(err1.msg);
  });

  if (!errors.isEmpty()) {
    return res.json({ status: 'failure', errors: errorArray });
  }
  next();
};

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
 * User fetches all questions he/she has ever asked.
 */
router.get('/my-questions', verifyUser, (req, res) => {
  const { userId } = req.body;
  client.query(queries.get_all_user_questions, [userId], (err, results) => {
    if (err) {
      return res.status(200).json({ status: 'failure', errors: ['an error occurred'] });
    }
    return res.status(200).json({
      status: 'success', errors: null, questions: results.rows, token: generateToken(req.body.userId),
    });
  });
});

/**
 * Search for questions on the platform.
 */
router.get('/search', verifyUser, (req, res) => {
  const { query } = req.query;
  client.query(queries.search_for_question, [`%${query}%`], (err, results) => {
    if (err) {
      return res.status(200).json({ status: 'failure', errors: ['an error occurred'] });
    }
    return res.status(200).json({
      status: 'success', errors: null, questions: results.rows, token: generateToken(req.body.userId),
    });
  });
});


/**
 * Get all the most answered questions.
 */
router.get('/popular-questions', verifyUser, (req, res) => {
  client.query(queries.get_questions_by_answer_count, (err, results) => {
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
    const question = results.rows[0];

    if (question) {
      client.query(queries.get_user_by_id, [question.user_id], (err0, results0) => {
        if (err0) {
          return res.status(200).json({ status: 'failure', errors: ['an error occurred'] });
        }
        question.user = results0.rows[0];
        delete question.user_id;
        client.query(queries.get_answers_for_question, [question.question_id], (err1, results1) => {
          if (err1) {
            return res.status(200).json({ status: 'failure', errors: ['an error occurred'] });
          }
          const answers = results1.rows;
          const newAnswers = [];
          for (let i = 0; i < answers.length; i += 1) {
            const ans = answers[i];
            const ansId = ans.answer_id;

            client.query(queries.get_user_by_id, [ans.answerer_user_id], (errr, resultss) => {
              if (errr) {
                return res.status(200).json({ status: 'failure', errors: ['an error occurred'] });
              }
              client.query(queries.get_comments_for_answer, [ansId], (err2, results2) => {
                if (err2) {
                  return res.status(200).json({ status: 'failure', errors: ['an error occurred'] });
                }
                ans.user = resultss.rows[0];
                ans.comments = results2.rows;
                newAnswers[i] = ans;
                if (i === answers.length - 1) {
                  question.answers = newAnswers;
                  return res.status(200).json({
                    status: 'success', errors: null, question, token: generateToken(req.body.userId),
                  });
                }
              });
            });
          }
        });
      });
    } else {
      return res.status(200).json({
        status: 'success', errors: null, question: [], token: generateToken(req.body.userId),
      });
    }
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
], validateRoute, (req, res) => {
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
    const question = results1.rows[0];
    question.answers = [];
    return res.status(200).json({
      status: 'success', errors: null, question, token: generateToken(userId),
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
router.post('/:questionId/answer', verifyUser, [
  check('content').exists().withMessage('Enter content').trim()
    .isLength({ min: 20 })
    .withMessage('Minimum length for content is 20'),
], validateRoute, (req, res) => {
  const { content, userId } = req.body;
  const { questionId } = req.params;
  const answerId = uuidv4().toString();

  client.query(queries.increase_answer_count, [questionId], (err, results) => {
    if (err) {
      return res.status(200).json({ status: 'failure', errors: ['an error occurred'] });
    }
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
        status: 'success', errors: null, question: results1.rows[0], token: generateToken(userId),
      });
    });
});

/**
 * Upvote or downvote an answer.
 */
router.put('/:questionId/answers/:answerId/vote', verifyUser, [
  check('vote').exists().withMessage('enter vote'),
], validateRoute, (req, res) => {
  const { vote } = req.body;
  const { answerId } = req.params;
  let type;
  if (vote === 'up') {
    type = queries.up_vote_answer;
  } else if (vote === 'down') {
    type = queries.down_vote_answer;
  }
  client.query(type, [answerId], (err, results) => {
    if (err) {
      return res.status(200).json({ status: 'failure', errors: ['an error occurred'] });
    }
    return res.status(200).json({
      status: 'success', errors: null, answer: results.rows[0], token: generateToken(req.body.userId),
    });
  });
});

/**
 * Comment on an answer.
 */
router.post('/:questionId/answers/:answerId/comment', verifyUser, [
  check('content').exists().withMessage('enter comment body'),
], validateRoute, (req, res) => {
  const { userId, content } = req.body;
  const { answerId } = req.params;
  // const commentReturn = 'comment_id, answer_id, content, poster_user_id, created_at';
  const commentId = uuidv4().toString();
  client.query(queries.add_comment, [commentId, answerId, content,
    userId, new Date()], (err1, results1) => {
    if (err1) {
      return res.status(200).json({ status: 'failure', errors: ['an error occurred'] });
    }
    return res.status(200).json({
      status: 'success', errors: null, comment: results1.rows[0], token: generateToken(userId),
    });
  });
});


module.exports = router;
