const userReturn = 'user_id, username, email, first_name, last_name, created_at';
module.exports = {
  create_user_table: `CREATE TABLE IF NOT EXISTS users (user_id TEXT PRIMARY KEY NOT NULL,
                    username TEXT,
                    password TEXT,
                    email TEXT,
                    first_name TEXT,
                    last_name TEXT,
                    created_at TIMESTAMP,
                    UNIQUE(username, email) );`,
  check_if_table_exists: 'SELECT user FROM users WHERE username = $1;',
  get_user_by_username: `SELECT ${userReturn} FROM users WHERE username = $1 `,
  get_user_by_id: `SELECT ${userReturn} FROM users WHERE user_id = $1 `,
  get_user_get_password: 'SELECT * FROM users WHERE username = $1;',
  get_user_by_email: `SELECT ${userReturn} FROM users WHERE email=$1`,
  create_user: `INSERT INTO users (user_id, username, password, email, first_name, last_name, created_at)
                VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING ${userReturn}`,
  create_question_table: `CREATE TABLE IF NOT EXISTS questions (question_id TEXT PRIMARY KEY NOT NULL,
                         category TEXT,
                         title TEXT,
                         content TEXT,
                         preferred_answer_id TEXT,
                         user_id TEXT REFERENCES users(user_id),
                         answer_count INTEGER,
                         created_at TIMESTAMP );`,
  create_answers_table: `CREATE TABLE IF NOT EXISTS answers (answer_id TEXT PRIMARY KEY NOT NULL,
                         question_id TEXT REFERENCES questions(question_id) ON DELETE CASCADE,
                         content TEXT,
                         answerer_user_id TEXT REFERENCES users(user_id) ON DELETE RESTRICT,
                         up_votes INTEGER,
                         down_votes INTEGER, 
                         created_at TIMESTAMP );`,
  create_comments_table: `CREATE TABLE IF NOT EXISTS comments (comment_id TEXT PRIMARY KEY NOT NULL,
                          answer_id TEXT REFERENCES answers(answer_id) ON DELETE CASCADE,
                          content TEXT,
                          poster_user_id TEXT REFERENCES users(user_id) ON DELETE RESTRICT,
                          created_at TIMESTAMP );`,
  add_question: `INSERT INTO questions (question_id, category, title, content, user_id, answer_count, created_at) 
                 VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
  get_all_questions: 'SELECT * FROM questions;',
  get_question_by_id: 'SELECT * FROM questions WHERE question_id = $1 ;',
  add_answer: `INSERT INTO answers (answer_id, question_id, content, answerer_user_id, up_votes, down_votes, created_at)
               VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
  mark_answer_as_preferred: `UPDATE questions 
                             SET preferred_answer_id = $1
                             WHERE question_id = $2
                             RETURNING *;`,
  delete_question_by_id: `DELETE FROM questions
                          WHERE question_id = $1;`,
};
