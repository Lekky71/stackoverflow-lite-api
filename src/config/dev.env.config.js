const express = require('express');

const app = express();
if (app.get('env') === 'development') {
  module.exports = true;
} else {
  module.exports = false;
}
