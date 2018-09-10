import express from 'express';

const router = express.Router();

/* GET home page. */
router.get('/', (req, res) => {
  // res.json({
  //   message: 'Welcome to StackOverFlowLite API',
  //   pivotal_tracker: 'https://www.pivotaltracker.com/projects/2192115',
  //   swagger: 'https://app.swaggerhub.com/apis/Oluwalekae/StackOFlow-Lite/1.0',
  // });
  return res.send(`<html>
                       <p>Welcome to StackOverFlowLite API</p>
                       <a href="https://www.pivotaltracker.com/projects/2192115">pivotal_tracker_link</a>
                       <br/>
                       <a href="https://app.swaggerhub.com/apis/Oluwalekae/StackOFlow-Lite/1.0">swagger_link</a>
                    </html>`);
});

module.exports = router;
