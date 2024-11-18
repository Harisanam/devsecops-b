import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/config.js';

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    console.log('Token tidak ditemukan.');
    return res.status(401).json({ error: 'Access denied, no token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    console.log('Token valid. User ID:', req.user.userId);
    next();
  } catch (error) {
    console.error('Token tidak valid:', error.message);
    res.status(403).json({ error: 'Invalid token' });
  }
};

export default authMiddleware;
