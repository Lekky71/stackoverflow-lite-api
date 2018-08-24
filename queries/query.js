
const userReturn = 'RETURNING id, username, email, first_name, last_name, created_at';
module.exports = {
  create_user_table: `CREATE TABLE users (id SERIAL PRIMARY KEY NOT NULL,
                    username TEXT,
                    password TEXT,
                    email TEXT,
                    first_name TEXT,
                    last_name TEXT,
                    created_at TIMESTAMP,
                    UNIQUE(username, email) );`,
  check_if_table_exists: `SELECT user FROM users WHERE username=$1 ${userReturn}`,
  find_user_by_username: `SELECT user FROM users WHERE username=$1 ${userReturn}`,
  find_user_get_password: `SELECT user FROM users WHERE username=$1 ${userReturn}, password`,
  find_user_by_email: `SELECT id FROM users WHERE email=$1 ${userReturn}`,
  create_user: `INSERT INTO users (username, password, email, first_name, last_name, created_at)
                VALUES ($1, $2, $3, $4, $5, $6) ${userReturn}`,
};
