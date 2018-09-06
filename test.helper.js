const register = require('babel-register');

register({
  ignore: /node_modules\/(?!so-lite-api)/,
});
