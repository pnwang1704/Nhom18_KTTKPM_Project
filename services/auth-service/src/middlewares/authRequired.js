const { verifyToken } = require('../config/jwt');

function authRequired(req, res, next) {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized'
    });
  }

  const token = authorizationHeader.slice(7).trim();

  try {
    const decodedToken = verifyToken(token);
    req.user = {
      userId: decodedToken.userId,
      email: decodedToken.email,
      role: decodedToken.role
    };
    return next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized'
    });
  }
}

module.exports = authRequired;