'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bcryptjs = require('bcryptjs');

var _bcryptjs2 = _interopRequireDefault(_bcryptjs);

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _pg = require('pg');

var _check = require('express-validator/check');

var _config = require('../config/config');

var _config2 = _interopRequireDefault(_config);

var _query = require('../queries/query');

var _query2 = _interopRequireDefault(_query);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();
var client = new _pg.Client({
  user: _config2.default.postgresql.user,
  host: _config2.default.postgresql.host,
  database: _config2.default.postgresql.database,
  password: _config2.default.postgresql.password,
  port: _config2.default.postgresql.port
});

client.connect(function (err) {
  if (err) console.log('could not connect to Database : ' + JSON.stringify(err));else {
    console.log('Successfully connected to database');
    client.query(_query2.default.check_if_table_exists, ['hashirAMA'], function (err1, results) {
      if (err1) {
        client.query(_query2.default.create_user_table).then(function (result) {}).catch(function (err2) {
          console.log(err2);
        });
      }
    });
  }
});
router.post('/signup', [(0, _check.check)('username').exists().withMessage('Enter username').trim().isLength({ min: 5 }).withMessage('Minimum length for username is 5'), (0, _check.check)('email').isEmail().withMessage('Enter a valid email').trim().normalizeEmail(), (0, _check.check)('password').exists().withMessage('Enter a strong password').isLength({ min: 5 }).withMessage('Minimum length for password is 5'), (0, _check.check)('first_name').exists().withMessage('Enter first name').trim().isLength({ min: 3 }).withMessage('Minimum length for first name is 3'), (0, _check.check)('last_name').exists().withMessage('Enter last name').trim().isLength({ min: 3 }).withMessage('Minimum length for last name is 3')], function (req, res) {
  var errors = (0, _check.validationResult)(req);
  var errorArray = [];
  errors.array().forEach(function (err1) {
    errorArray.push(err1.msg);
  });

  if (!errors.isEmpty()) {
    return res.json({ status: 'failure', errors: errorArray });
  }

  var _req$body = req.body,
      username = _req$body.username,
      email = _req$body.email,
      password = _req$body.password;

  var firstName = req.body.first_name;
  var lastName = req.body.last_name;

  JSON.stringify(client.query(_query2.default.find_user_by_username, [username], function (err, result) {
    if (result) {
      return res.status(200).json({ status: 'failure', errors: ['username is taken'] });
    }
    JSON.stringify(client.query(_query2.default.find_user_by_email, [email], function (err1, result1) {
      if (result1) {
        return res.status(200).json({ status: 'failure', errors: ['email is taken'] });
      }
      _bcryptjs2.default.hash(password, 10, function (err2, hash) {
        if (err2) return res.status(200).json({ status: 'failure', errors: ['bad password'] });
        client.query(_query2.default.create_user, [username, hash, email, firstName, lastName, new Date()], function (err3, result2) {
          if (err3) return res.status(200).json({ status: 'failure', errors: ['could not create account'] });
          var user = result2.rows[0];
          var token = _jsonwebtoken2.default.sign({ id: user.id }, _config2.default.jwt.secret);
          return res.status(200).json({
            status: 'success',
            user: user,
            token: token
          });
        });
      });
    }));
  }));
});

router.post('/login', [(0, _check.check)('username').exists().withMessage('Enter username').trim().isLength({ min: 5 }).withMessage('Minimum length for username is 5'), (0, _check.check)('password').exists().withMessage('Enter password').isLength({ min: 5 }).withMessage('Minimum length for password is 5')], function (req, res) {
  var errors = (0, _check.validationResult)(req);
  var errorArray = [];
  errors.array().forEach(function (err1) {
    errorArray.push(err1.msg);
  });

  if (!errors.isEmpty()) {
    return res.json({ status: 'failure', errors: errorArray });
  }

  var _req$body2 = req.body,
      username = _req$body2.username,
      password = _req$body2.password;

  client.query(_query2.default.find_user_get_password, [username], function (err, results) {
    if (err) console.log(err);
    console.log('User logging in : ' + results);
    if (results) {
      var user = results.rows[0];
      var token = _jsonwebtoken2.default.sign({ id: user.id }, _config2.default.jwt.secret);
      _bcryptjs2.default.compare(password, user.password, function (err2, result) {
        if (result) {
          return res.status(200).json({
            status: 'success',
            user: user,
            token: token
          });
        }
        return res.status(200).json({ status: 'failure', errors: ['Invalid login details'] });
      });
    } else {
      return res.status(200).json({ status: 'failure', errors: ['Invalid login details usaw'] });
    }
  });
});
module.exports = router;
//# sourceMappingURL=auth.controller.js.map