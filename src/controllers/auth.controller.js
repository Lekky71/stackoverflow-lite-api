import express from 'express';
import bcrypt from 'bcryptjs';
import { Client } from 'pg';
import { check, validationResult } from 'express-validator/check';
import uuidv4 from 'uuid/v4';
import tokenController from './token.controller';
import config from '../config/config';
import queries from '../queries/query';


const router = express.Router();
const client = new Client({
  user: config.postgresql.user,
  host: config.postgresql.host,
  database: config.postgresql.database,
  password: config.postgresql.password,
  port: config.postgresql.port,
});

client.connect((err) => {
  if (err) console.log(`could not connect to Database : ${JSON.stringify(err)}`);
  else {
    console.log('Successfully connected to database');
    client.query(queries.create_user_table)
      .then((result) => {

      }).catch((err2) => {
      });
  }
});
router.post('/signup', [
  check('username').exists().withMessage('Enter username').trim()
    .isLength({ min: 5 })
    .withMessage('Minimum length for username is 5'),
  check('email').isEmail().withMessage('Enter a valid email').trim()
    .normalizeEmail(),
  check('password').exists().withMessage('Enter a strong password').isLength({ min: 5 })
    .withMessage('Minimum length for password is 5'),
  check('first_name').exists().withMessage('Enter first name').trim()
    .isLength({ min: 3 })
    .withMessage('Minimum length for first name is 3'),
  check('last_name').exists().withMessage('Enter last name').trim()
    .isLength({ min: 3 })
    .withMessage('Minimum length for last name is 3'),

], (req, res) => {
  const errors = validationResult(req);
  const errorArray = [];
  errors.array().forEach((err1) => {
    errorArray.push(err1.msg);
  });

  if (!errors.isEmpty()) {
    return res.json({ status: 'failure', errors: errorArray });
  }

  const { username, email, password } = req.body;
  const firstName = req.body.first_name;
  const lastName = req.body.last_name;

  client.query(queries.find_user_by_username, [username], (err, result) => {
    if (err) {
      return res.status(200).json({ status: 'failure', errors: ['username is taken'] });
    }
    client.query(queries.find_user_by_email, [email], (err1, result1) => {
      if (err1) {
        return res.status(200).json({ status: 'failure', errors: ['email is taken'] });
      }
      bcrypt.hash(password, 10, (err2, hash) => {
        if (err2) return res.status(200).json({ status: 'failure', errors: ['bad password'] });
        const userId = uuidv4().toString();
        client.query(queries.create_user, [userId, username, hash, email, firstName,
          lastName, new Date()],
        (err3, result2) => {
          if (err3) return res.status(200).json({ status: 'failure', errors: ['could not create account'] });
          const user = result2.rows[0];
          const token = tokenController.generateToken(user.id);
          return res.status(200).json({
            status: 'success',
            user,
            token,
          });
        });
      });
    });
  });
});

router.post('/login', [
  check('username').exists().withMessage('Enter username').trim()
    .isLength({ min: 5 })
    .withMessage('Minimum length for username is 5'),
  check('password').exists().withMessage('Enter password').isLength({ min: 5 })
    .withMessage('Minimum length for password is 5'),
], (req, res) => {
  const errors = validationResult(req);
  const errorArray = [];
  errors.array().forEach((err1) => {
    errorArray.push(err1.msg);
  });

  if (!errors.isEmpty()) {
    return res.json({ status: 'failure', errors: errorArray });
  }

  const { username, password } = req.body;
  client.query(queries.find_user_get_password, [username], (err, results) => {
    if (err) return res.status(200).json({ status: 'failure', errors: ['could not login'] });
    if (results.rows[0]) {
      const user = results.rows[0];
      const token = tokenController.generateToken(user.id);
      bcrypt.compare(password, user.password, (err2, result) => {
        if (result) {
          delete user.password;
          return res.status(200).json({
            status: 'success',
            user,
            token,
          });
        }
        return res.status(200).json({ status: 'failure', errors: ['Invalid login details'] });
      });
    } else {
      return res.status(200).json({ status: 'failure', errors: ['Invalid login detailswa'] });
    }
  });
});
module.exports = router;
