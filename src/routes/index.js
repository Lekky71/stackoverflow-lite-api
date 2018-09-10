import express from 'express';

const router = express.Router();
/* GET home page. */
router.get(['/api/v1', '/'], (req, res) => res.send(`<html>
                       <p>Welcome to StackOverFlowLite API</p>
                       <a href="https://www.pivotaltracker.com/projects/2192115" target="_blank">pivotal_tracker_link</a>
                       <br/>
                       <a href="https://app.swaggerhub.com/apis/Oluwalekae/StackOFlow-Lite/1.0" target="_blank">swagger_link</a>
                    </html>`));

module.exports = router;
