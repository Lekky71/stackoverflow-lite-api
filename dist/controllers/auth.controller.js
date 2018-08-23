'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _bcryptjs = require('bcryptjs');

var _bcryptjs2 = _interopRequireDefault(_bcryptjs);

var _pg = require('pg');

var _check = require('express-validator/check');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();
var pool = (0, _pg.Pool)();

var client = (0, _pg.Client)();
client.connect();

router.post('/signup', [(0, _check.check)('username').exists().withMessage('Enter username').trim().isLength({ min: 5 }).withMessage('Minimum length for username is 5'), (0, _check.check)('email').isEmail().withMessage('Enter a valid email').trim().normalizeEmail(), (0, _check.check)('password').exists().withMessage('Enter a strong password').isLength({ min: 5 }).withMessage('Minimum length for password is 5'), (0, _check.check)('first_name').exists().withMessage('Enter first name').trim().isLength({ min: 3 }).withMessage('Minimum length for first name is 3'), (0, _check.check)('last_name').exists().withMessage('Enter last name').trim().isLength({ min: 3 }).withMessage('Minimum length for last name is 3')], function (req, res) {
  var errors = (0, _check.validationResult)(req);
  var errorArray = [];
  errors.array().forEach(function (err1) {
    errorArray.push(err1.msg);
  });
  if (!errors.isEmpty()) {
    return res.json({ status: 'failure', errors: errorArray });
  }
  var username = req.body.username;
  var email = req.body.email;
  var password = req.body.email;
  var firstName = req.body.first_name;
  var lastName = req.body.last_name;
});
//# sourceMappingURL=auth.controller.js.map