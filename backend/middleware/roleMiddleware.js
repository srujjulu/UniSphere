export const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, error: 'Authentication required.' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: `Access forbidden. This action requires one of the following roles: [${allowedRoles.join(', ')}]. Current role: ${req.user.role}`
      });
    }

    next();
  };
};

export const requireClubAccess = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ success: false, error: 'Authentication required.' });
  }

  const requestedClubId = req.params.clubId || req.body.clubId;

  // Admin and Faculty have global access to all clubs
  if (req.user.role === 'admin' || req.user.role === 'faculty') {
    return next();
  }

  // Core team coordinator can only manage their assigned club (or all if assignedClub === 'all')
  if (req.user.role === 'core') {
    if (req.user.assignedClub === 'all' || req.user.assignedClub === requestedClubId) {
      return next();
    }
    return res.status(403).json({
      success: false,
      error: `Forbidden. You are coordinator for "${req.user.assignedClub}", not "${requestedClubId}".`
    });
  }

  return res.status(403).json({ success: false, error: 'Access denied.' });
};
