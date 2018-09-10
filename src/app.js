import createError from 'http-errors';
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import favicon from 'serve-favicon';
import dotenv from 'dotenv';
import cors from 'cors';
import indexRouter from './routes/index';
import authController from './controllers/auth.controller';
import questionController from './controllers/question.controller';


dotenv.config({ path: path.join(__dirname.replace('dist', ''), '.env') });

const app = express();

/**
 * @const apiVersion : api version
 * @type {string}
 */
const apiVersion = 'api/v1';

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// app.use(cors());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://stack-overflow-lite-frontend.herokuapp.com, http://localhost:63342');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, x-access-token, Accept');
  next();
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(favicon(path.join(__dirname.replace('dist', 'public'), 'favicon.ico')));
app.use(express.static(path.join(__dirname.replace('dist', ''), 'public')));

app.use('/', indexRouter);
app.use(`/${apiVersion}/auth`, authController);
app.use(`/${apiVersion}/questions`, questionController);

// catch 404 and forward to error handler

app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`App is listening live on port ${process.env.PORT}`);
});

module.exports = app;
