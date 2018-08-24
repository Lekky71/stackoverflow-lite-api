import createError from 'http-errors';
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import dotenv from 'dotenv';
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

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

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

app.listen(process.env.API_PORT, () => { console.log(`App is listening on port ${process.env.API_PORT}`); });

module.exports = app;