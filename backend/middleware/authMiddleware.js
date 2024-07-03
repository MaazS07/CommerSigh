const admin = require('../firebaseAdmin');
const cookieParser = require('cookie-parser');

const authMiddleware = async (req, res, next) => {
  const sessionCookie = req.cookies.session || '';

  try {
    const decodedClaims = await admin.auth().verifySessionCookie(sessionCookie, true);
    req.user = decodedClaims;
    next();
  } catch (error) {
    res.redirect('/');
  }
};

module.exports = authMiddleware;
