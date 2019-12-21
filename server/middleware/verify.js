const jwt = require('jsonwebtoken');


module.exports = function (req, res, next) {
  const header = req.headers["authorization"];

  if (typeof header !== 'undefined') {
    const token = header.split(' ')[1];
    // if no token found, return response (without going to the next middelware)
    if (!token) return res.status(401).json({ error: "Access denied. No token provide" });

    try {
      const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET)
      req.user = decodedToken;
      next();
    } catch (err) {
      res.status(401).json({ error: 'Invalid token' })
    }
  } else {
    res.status(403).json({ error: 'Forbidden' });
  }
}