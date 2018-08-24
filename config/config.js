const config = {
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

module.exports = config;
