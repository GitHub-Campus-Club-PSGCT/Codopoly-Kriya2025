const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  let token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: 'No token provided, authorization denied!' });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET);
    req.teamId = decoded.teamId;  // Attach teamId to the request
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token!' });
  }
};

module.exports = { protect };
