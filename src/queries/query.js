const userReturn = 'id, username, email, first_name, last_name, created_at';
module.exports = {
  create_user_table: `CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY NOT NULL,
                    username TEXT,
                    password TEXT,
                    email TEXT,
                    first_name TEXT,
                    last_name TEXT,
                    created_at TIMESTAMP,
                    UNIQUE(username, email) );`,
  check_if_table_exists: 'SELECT user FROM users WHERE username = $1;',
  find_user_by_username: `SELECT ${userReturn} FROM users WHERE username = $1 `,
  find_user_get_password: 'SELECT * FROM users WHERE username = $1;',
  find_user_by_email: `SELECT ${userReturn} FROM users WHERE email=$1`,
  create_user: `INSERT INTO users (id, username, password, email, first_name, last_name, created_at)
                VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING ${userReturn}`,
  create_question_table: `CREATE TABLE IF NOT EXISTS questions (question_id TEXT PRIMARY KEY NOT NULL,
                         category TEXT,
                         text TEXT,
                         preferred_answer_id TEXT,
                         asker_user_id TEXT,
                         answer_count INTEGER,
                         created_at TIMESTAMP );`,
};
