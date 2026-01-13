/**
 * Role-Based Access Control Middleware
 */

/**
 * Require specific role(s)
 */
const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required',
        code: 'NOT_AUTHENTICATED'
      });
    }

    const roles = allowedRoles.flat();

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: 'Access denied. Insufficient permissions.',
        code: 'INSUFFICIENT_PERMISSIONS'
      });
    }

    next();
  };
};

// Convenience shortcuts
const adminOnly = requireRole('admin');
const cashierOrAdmin = requireRole('cashier', 'admin');
const anyAuthenticated = requireRole('user', 'cashier', 'admin');

/**
 * Owner or admin access
 */
const ownerOrAdmin = (getResourceOwnerId) => {
  return async (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, error: 'Authentication required' });
    }

    if (req.user.role === 'admin') return next();

    try {
      const resourceOwnerId = await getResourceOwnerId(req);
      
      if (!resourceOwnerId) {
        return res.status(404).json({ success: false, error: 'Resource not found' });
      }

      if (resourceOwnerId.toString() === req.user._id.toString()) {
        return next();
      }

      return res.status(403).json({ success: false, error: 'Access denied. Not owner.' });
    } catch (error) {
      return res.status(500).json({ success: false, error: 'Authorization check failed' });
    }
  };
};

module.exports = { requireRole, adminOnly, cashierOrAdmin, anyAuthenticated, ownerOrAdmin };
