import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { Pool, Client } from 'pg';

import { check, validationResult } from 'express-validator/check';

const router = express.Router();
const pool = Pool();


const client = Client();
client.connect();

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
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.email;
  const firstName = req.body.first_name;
  const lastName = req.body.last_name;


});
