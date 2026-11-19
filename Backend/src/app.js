import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import authRoutes from './routes/authRoutes.js';
import vehicleRoutes from './routes/vehicleRoutes.js';
import kycRoutes from './routes/kycRoutes.js'; 
import productRoutes from './routes/productRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
const app = express();

app.use(helmet({ crossOriginResourcePolicy: false })); 
app.use(cors());
app.use(express.json());

app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/kyc', kycRoutes); 
app.use('/api/admin', adminRoutes); 
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.get('/', (req, res) => {
  res.status(200).json({ status: 'success', message: 'Merkato Backend API is running smoothly 🚀' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong on the server' });
});

app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    console.error("Multer Error:", err);
    return res.status(400).json({ message: `Upload error: ${err.message}` });
  } 
  console.error(err.stack);
  res.status(500).json({ message: err.message || 'Something went wrong on the server' });
});

export default app;