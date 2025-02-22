const Admin = require('../models/admin')
const checkEventStatus = async (req, res, next) => {
    const admin = await Admin.findOne({ username: 'Akash' });
    if (!admin) return res.status(500).json({ message: 'Admin record not found.' });
  
    if (admin.eventStatus !== 'auction' && req.path.includes('/auction')) {
      return res.status(403).json({ message: 'Auction is not active.' });
    }
  
    if (admin.eventStatus !== 'debugging' && req.path.includes('/debug')) {
      return res.status(403).json({ message: 'Debugging is not active.' });
    }
  
    next();
  };

module.exports = checkEventStatus;
  