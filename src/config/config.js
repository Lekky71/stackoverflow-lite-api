import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.join(__dirname.replace('dist/config', ''), '.env') });

module.exports = {
  appName: process.env.APP_NAME,
  port: process.env.API_PORT,
  postgresql: {
    host: process.env.PGHOST,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
    port: process.env.PGPORT,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
  },
};
