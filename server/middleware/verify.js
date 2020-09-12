const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  const header = req.headers['authorization'];

  if (typeof header !== 'undefined') {
    const token = header.split(' ');
    // if no token found, return response (without going to the next middleware)
    if (token[0] !== 'Bearer')
      return res.notAuthorized({ error: 'Invalid authorization header.' });
    if (!token[1])
      return res.notAuthorized({ error: 'Access denied. No token provide' });

    try {
      const decodedToken = jwt.verify(token[1], process.env.TOKEN_SECRET);
      req.user = decodedToken;
      next();
    } catch (err) {
      res.notAuthorized({ error: 'Invalid token' });
    }
  } else {
    res.status(403).json({ error: 'Forbidden' });
  }
};
