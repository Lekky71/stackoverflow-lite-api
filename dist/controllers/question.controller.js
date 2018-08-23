'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

/**
 * Get all questions.
 */
router.get('/', function (req, res) {});

/**
 * Get a question.
 * @param questionId : question id
 */
router.get('/:questionId', function (req, res) {
  var id = req.params.id;
});

/**
 * Post a question.
 */
router.post('/', function (req, res) {});

/**
 * Delete a question.
 */
router.delete('/:questionId', function (req, res) {});

/**
 * Post an answer to a question.
 */
router.post('/:questionId/answer', function (req, res) {});

/**
 * Question poster can mark an answer a preferred.
 */
router.put('/:questionId/answers/:answerId/mark', function (req, res) {});

/**
 * Upvote or downvote an answer.
 */
router.put('/vote', function (req, res) {});

/**
 * Comment on an answer.
 */
router.post('/comment', function (req, res) {});

/**
 * User fetches all questions he/she has ever asked.
 */
router.get('/my-questions', function (req, res) {});

/**
 * Search for questions on the platform.
 */
router.get('/search', function (req, res) {});

/**
 * Get all the most answered questions.
 */
router.get('/popular-questions', function (req, res) {});
//# sourceMappingURL=question.controller.js.map