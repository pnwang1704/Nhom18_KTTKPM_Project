const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/env');

const authMiddleware = (roles = []) => {
  return (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: No token provided'
      });
    }

    const token = authHeader.split(' ')[1];

    try {
      // Security fix: explicitly specify HS256 to prevent algorithm confusion
      const decoded = jwt.verify(token, jwtSecret, { algorithms: ['HS256'] });
      req.user = decoded;

      // RBAC check (Case-insensitive)
      if (roles.length > 0) {
        const userRole = (decoded.role || '').toUpperCase();
        const requiredRoles = roles.map(r => r.toUpperCase());
        
        if (!requiredRoles.includes(userRole)) {
          return res.status(403).json({
            success: false,
            message: 'Forbidden: Insufficient permissions',
            data: null,
            errorCode: 'INSUFFICIENT_PERMISSIONS'
          });
        }
      }

      next();
    } catch (error) {
      console.error('[auth error]', error.name, error.message, '| Secret used:', jwtSecret.substring(0, 8) + '...');
      
      const isExpired = error.name === 'TokenExpiredError';
      
      return res.status(401).json({
        success: false,
        message: isExpired ? 'Unauthorized: Token has expired' : 'Unauthorized: Invalid token',
        data: null,
        errorCode: isExpired ? 'TOKEN_EXPIRED' : 'INVALID_TOKEN',
        reason: error.message
      });
    }
  };
};

module.exports = authMiddleware;
