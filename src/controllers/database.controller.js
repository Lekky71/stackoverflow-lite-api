import { Client } from 'pg';
import config from '../config/config';
import queries from '../queries/query';

const client = new Client({
  user: config.postgresql.user,
  host: config.postgresql.host,
  database: config.postgresql.database,
  password: config.postgresql.password,
  port: config.postgresql.port,
});

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
  client.query(queries.find_user_by_id, [userId], (err, results) => {
    if (err) callback(err, null);
    if (results.rows[0]) {
      return callback(null, results.rows[0]);
    }
    return callback('Error undefined', null);
  });
};

module.exports.client = client;
module.exports.findUserById = findUserById;
