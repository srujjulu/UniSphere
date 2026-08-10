import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../middleware/authMiddleware.js';
import { findOne, insertOne, findById } from '../config/db.js';

// Allowed CMR Group of Institutions domains
const ALLOWED_COLLEGE_DOMAINS = [
  '@cmr.edu.in',
  '@cmrtc.ac.in',
  '@cmrcet.ac.in',
  '@cmrec.ac.in'
];

export const isAllowedCollegeEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  const cleanEmail = email.trim().toLowerCase();
  return ALLOWED_COLLEGE_DOMAINS.some((domain) => cleanEmail.endsWith(domain));
};

// Generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      rollNumber: user.rollNumber,
      assignedClub: user.assignedClub
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// @desc Register a new user with College Email
// @route POST /api/auth/register
export const registerUser = async (req, res) => {
  try {
    const { name, email, rollNumber, password, role = 'student', assignedClub, department, year } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, error: 'Name, email, and password are required.' });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Enforce official college domain
    if (!isAllowedCollegeEmail(cleanEmail)) {
      return res.status(400).json({
        success: false,
        error: `Only official CMR college emails are permitted (${ALLOWED_COLLEGE_DOMAINS.join(', ')}).`
      });
    }

    // Check if user already exists
    const existing = findOne('users', (u) => u.email.toLowerCase() === cleanEmail);
    if (existing) {
      return res.status(400).json({ success: false, error: 'An account with this college email already exists.' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = insertOne('users', {
      name: name.trim(),
      email: cleanEmail,
      rollNumber: (rollNumber || cleanEmail.split('@')[0]).toUpperCase(),
      role: role.toLowerCase(),
      assignedClub: assignedClub || (role === 'core' ? 'akriti' : undefined),
      department: department || 'Engineering & Technology',
      year: year || '2026',
      password: passwordHash
    });

    const token = generateToken(newUser);

    return res.status(201).json({
      success: true,
      message: 'Account created successfully!',
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        rollNumber: newUser.rollNumber,
        role: newUser.role,
        assignedClub: newUser.assignedClub,
        department: newUser.department
      }
    });
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ success: false, error: 'Server error registering account.' });
  }
};

// @desc Login user
// @route POST /api/auth/login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password are required.' });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Verify college domain
    if (!isAllowedCollegeEmail(cleanEmail)) {
      return res.status(400).json({
        success: false,
        error: `Please sign in using your official CMR college email (${ALLOWED_COLLEGE_DOMAINS.join(', ')}).`
      });
    }

    const user = findOne('users', (u) => u.email.toLowerCase() === cleanEmail);
    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid college email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Invalid college email or password.' });
    }

    const token = generateToken(user);

    return res.status(200).json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        rollNumber: user.rollNumber,
        role: user.role,
        assignedClub: user.assignedClub,
        department: user.department
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ success: false, error: 'Server error during login.' });
  }
};

// @desc Get current authenticated user
// @route GET /api/auth/me
export const getMe = async (req, res) => {
  try {
    const user = findById('users', req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found.' });
    }

    return res.status(200).json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        rollNumber: user.rollNumber,
        role: user.role,
        assignedClub: user.assignedClub,
        department: user.department
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Server error fetching user.' });
  }
};

// @desc Quick Demo Login (for rapid testing without typing password)
// @route POST /api/auth/demo
export const loginDemo = async (req, res) => {
  try {
    const { role = 'student' } = req.body;
    const demoEmail = `${role}@cmr.edu.in`;

    let user = findOne('users', (u) => u.email.toLowerCase() === demoEmail);
    if (!user) {
      user = findOne('users', (u) => u.role === role);
    }

    if (!user) {
      return res.status(404).json({ success: false, error: `Demo account for role "${role}" not found.` });
    }

    const token = generateToken(user);

    return res.status(200).json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        rollNumber: user.rollNumber,
        role: user.role,
        assignedClub: user.assignedClub,
        department: user.department
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Demo login error.' });
  }
};
