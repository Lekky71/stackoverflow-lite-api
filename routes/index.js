import express from 'express';

const router = express.Router();

/* GET home page. */
router.get('/', (req, res) => {
  res.json({ message: 'Welcome to StackOverFlowLite API', pivotal_tracker: 'https://...  ', swagger: 'https://...' });
});

module.exports = router;
