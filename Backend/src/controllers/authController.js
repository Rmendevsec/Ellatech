import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import prisma from '../config/db.js';

// --- Zod Validation Schemas ---
const registerSchema = z.object({
  email: z.string().email().optional(),
  phone: z.string().min(10), // Add Ethiopian phone regex later
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(['CUSTOMER', 'DRIVER', 'MERCHANT']).default('CUSTOMER'),
});

const loginSchema = z.object({
  phone: z.string(),
  password: z.string(),
});

// --- Helper Functions ---
const generateTokens = (userId) => {
  const accessToken = jwt.sign({ id: userId }, process.env.JWT_ACCESS_SECRET, { expiresIn: '15m' });
  const refreshToken = jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
  return { accessToken, refreshToken };
};

// --- Controllers ---

// @desc    Register a new user
// @route   POST /api/auth/register
export const registerUser = async (req, res) => {
  try {
    // 1. Validate request body
    const validatedData = registerSchema.parse(req.body);

    // 2. Check if user already exists
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

    // 3. Hash the password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(validatedData.password, salt);

    // 4. Create user in database
    const user = await prisma.user.create({
      data: {
        phone: validatedData.phone,
        email: validatedData.email,
        passwordHash,
        role: validatedData.role,
      }
    });

    // 5. Generate Tokens
    const { accessToken, refreshToken } = generateTokens(user.id);

    res.status(201).json({
      message: 'User registered successfully',
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

// @desc    Login user
// @route   POST /api/auth/login
export const loginUser = async (req, res) => {
  try {
    // 1. Validate request body
    const validatedData = loginSchema.parse(req.body);

    // 2. Find user
    const user = await prisma.user.findUnique({
      where: { phone: validatedData.phone }
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // 3. Check password
    const isMatch = await bcrypt.compare(validatedData.password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // 4. Generate Tokens
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

// @desc    Get current user profile (Protected)
// @route   GET /api/auth/me
export const getMe = async (req, res) => {
  res.status(200).json({ user: req.user });
};