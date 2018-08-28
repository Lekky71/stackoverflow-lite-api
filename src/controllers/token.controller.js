import jwt from 'jsonwebtoken';
import config from '../config/config';

const verifyToken = (req, res, next) => {
  const token = req.headers['x-access-token'];
  if (!token) {
    return res.status(403).send({ status: 'failure', errors: ['No token provided'] });
  }
  jwt.verify(token, config.jwt.secret, (err, decoded) => {
    if (err) return res.status(403).json({ status: 'failure', errors: ['Failed to authenticate token'] });
    req.body.userId = decoded.id;
    next();
  });
};

const generateToken = (userId) => {
  if (userId) {
    return jwt.sign({ id: userId }, config.jwt.secret);
  }
  return '';
};

module.exports.verifyToken = verifyToken;
module.exports.generateToken = generateToken;
