import jwt from 'jsonwebtoken';
import prisma from '../config/db.js';

export const protect = async (req, res, next) => {
  let token;

  // Check if token exists in headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

      // Get user from the database (excluding password)
      req.user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: { id: true, email: true, phone: true, role: true, isVerified: true }
      });

      if (!req.user) {
        return res.status(401).json({ message: 'User not found' });
      }

      next(); // Move to the next controller
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// Role-based access control (e.g., only DRIVERS or ADMIN)
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: `Role (${req.user.role}) is not allowed to access this resource` });
    }
    next();
  };
};