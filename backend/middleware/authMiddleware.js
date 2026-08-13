import jwt from 'jsonwebtoken';
import { findById } from '../config/db.js';

export const JWT_SECRET = process.env.JWT_SECRET || 'unisphere_cmrtc_secret_key_2026';

export const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'Unauthorized. Authentication token is missing.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = findById('users', decoded.id);

    if (!user) {
      return res.status(401).json({ success: false, error: 'User associated with this token no longer exists.' });
    }

    // Attach safe user object to request
    req.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      rollNumber: user.rollNumber,
      role: user.role,
      assignedClub: user.assignedClub,
      department: user.department
    };

    next();
  } catch (err) {
    return res.status(401).json({ success: false, error: 'Invalid or expired token. Please sign in again.' });
  }
};

export const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = findById('users', decoded.id);

    if (user) {
      req.user = {
        id: user.id,
        name: user.name,
        email: user.email,
        rollNumber: user.rollNumber,
        role: user.role,
        assignedClub: user.assignedClub,
        department: user.department
      };
    }
  } catch (err) {
    // Ignore invalid token in optional auth
  }

  next();
};

