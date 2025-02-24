const Admin = require('../models/admin');

const checkRegistrationStatus = async (req, res, next) => {
  try {
    const admin = await Admin.findOne(); 
    if (!admin || !admin.isRegistrationOpen) {
      return res.status(403).json({ message: 'Registration is currently closed by the admin.' });
    }
    next();
  } catch (error) {
    return res.status(500).json({ message: 'Server error while checking registration status.' });
  }
};

module.exports = {checkRegistrationStatus};
