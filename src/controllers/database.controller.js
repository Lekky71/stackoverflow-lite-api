/* eslint-disable consistent-return,no-unused-vars */
import { Pool } from 'pg';
import jwt from 'jsonwebtoken';
import config from '../config/config';
import queries from '../queries/query';
import isDevEnv from '../config/dev.env.config';

let client;

let conString;
if (isDevEnv === true) {
  conString = config.postgresql.offlineConnectionString;
  client = new Pool({
    connectionString: conString,
  });
} else {
  client = new Pool({
    user: config.postgresql.user,
    host: config.postgresql.host,
    database: config.postgresql.database,
    password: config.postgresql.password,
    port: config.postgresql.port,
  });
}


client.connect((er) => {
  if (er) console.log(`could not connect to Database : ${JSON.stringify(er)}`);
  else {
    console.log('Successfully connected to database');
    client.query(queries.create_user_table)
      .then((result) => {
        client.query(queries.create_question_table)
          .then((result1) => {
            client.query(queries.create_answers_table)
              .then((result2) => {
                client.query(queries.create_comments_table)
                  .then((result3) => {

                  })
                  .catch((err3) => {

                  });
              })
              .catch((err2) => {

              });
          })
          .catch((err1) => {

          });
      }).catch((err) => {
      });
  }
});

const findUserById = (userId, callback) => {
  client.query(queries.get_user_by_id, [userId], (err, results) => {
    if (err) {
      if (callback) callback(err, null);
    }
    if (results.rows[0]) {
      if (callback) callback(null, results.rows[0]);
    } else if (callback) callback(err, null);
  });
};

const verifyUser = (req, res, next) => {
  const token = req.headers['x-access-token'];
  if (!token) {
    return res.status(403).send({ status: 'failure', errors: ['No token provided'] });
  }
  jwt.verify(token, config.jwt.secret, (err, decoded) => {
    if (err) return res.status(403).json({ status: 'failure', errors: ['Failed to authenticate token'] });
    req.body.userId = decoded.id;

    findUserById(decoded.id, (err1, user) => {
      if (user) {
        next();
      } else {
        return res.status(200).json({ status: 'failure', errors: ['could not verify token'] });
      }
    });
  });
};

module.exports.client = client;
module.exports.findUserById = findUserById;
module.exports.verifyUser = verifyUser;
