'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

/* GET home page. */
router.get('/', function (req, res) {
  res.json({ message: 'Welcome to StackOverFlowLite API', pivotal_tracker: 'https://...  ', swagger: 'https://...' });
});

module.exports = router;
//# sourceMappingURL=index.js.map