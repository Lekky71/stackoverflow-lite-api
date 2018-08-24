'use strict';

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _config = require('../config/config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var verifyToken = function verifyToken(req, res, next) {
  var token = req.headers['x-access-token'];
  if (!token) {
    return res.status(403).send({ auth: false, message: 'No token provided.' });
  }
  _jsonwebtoken2.default.verify(token, _config2.default.jwt.secret, function (err, decoded) {
    if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token' });
    req.userId = decoded.id;
    next();
  });
};

module.exports = verifyToken;
//# sourceMappingURL=token.controller.js.map