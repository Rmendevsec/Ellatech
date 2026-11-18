import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import prisma from '../config/db.js';

const registerSchema = z.object({
  email: z.string().email().optional(),
  phone: z.string().min(10),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

const loginSchema = z.object({
  phone: z.string(),
  password: z.string(),
});

const generateTokens = (userId) => {
  const accessToken = jwt.sign({ id: userId }, process.env.JWT_ACCESS_SECRET, { expiresIn: '15m' });
  const refreshToken = jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
  return { accessToken, refreshToken };
};

const createUser = async (req, res, assignedRole) => {
  try {
    const validatedData = registerSchema.parse(req.body);

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { phone: validatedData.phone },
          validatedData.email ? { email: validatedData.email } : {}
        ]
      }
    });

    if (existingUser) {
      return res.status(400).json({ message: 'User with this phone or email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(validatedData.password, salt);

    const user = await prisma.user.create({
      data: {
        phone: validatedData.phone,
        email: validatedData.email,
        passwordHash,
        role: assignedRole, 
      }
    });

    const { accessToken, refreshToken } = generateTokens(user.id);

    res.status(201).json({
      message: `${assignedRole} registered successfully`,
      user: { id: user.id, phone: user.phone, email: user.email, role: user.role },
      accessToken,
      refreshToken
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Validation error', errors: error.errors });
    }
    console.error(error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

// --- Controllers ---

export const registerCustomer = (req, res) => createUser(req, res, 'CUSTOMER');

export const registerDriver = (req, res) => createUser(req, res, 'DRIVER');

export const registerMerchant = (req, res) => createUser(req, res, 'MERCHANT');

export const loginUser = async (req, res) => {
  try {
    const validatedData = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({
      where: { phone: validatedData.phone }
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(validatedData.password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const { accessToken, refreshToken } = generateTokens(user.id);

    res.status(200).json({
      message: 'Login successful',
      user: { id: user.id, phone: user.phone, email: user.email, role: user.role },
      accessToken,
      refreshToken
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Validation error', errors: error.errors });
    }
    console.error(error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

export const getMe = async (req, res) => {
  res.status(200).json({ user: req.user });
};