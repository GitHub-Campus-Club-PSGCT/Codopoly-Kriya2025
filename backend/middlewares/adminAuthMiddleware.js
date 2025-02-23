const jwt = require('jsonwebtoken');
const Admin = require('../models/admin');

const adminAuthMiddleware = async (req, res, next) => {
  const token = req.header('Authorization').replace('Bearer ', '');

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findById(decoded.id);

    if (!admin) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    req.user = { id: admin._id, username: admin.username };  // Attach admin details to the request
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

module.exports = adminAuthMiddleware;
