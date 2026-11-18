import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import authRoutes from './routes/authRoutes.js';

const app = express();

// Security Middleware
app.use(helmet()); // Sets HTTP headers for security
app.use(cors()); // Allow cross-origin requests
app.use(express.json()); // Parse JSON bodies

// Routes
app.use('/api/auth', authRoutes);

// Health Check
app.get('/', (req, res) => {
  res.status(200).json({ status: 'success', message: 'Merkato Backend API is running smoothly 🚀' });
});

// Global Error Handler (fallback)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong on the server' });
});

export default app;