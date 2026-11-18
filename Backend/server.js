import dotenv from 'dotenv';
import app from './src/app.js';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Merkato Server running on port ${PORT} in ${process.env.NODE_ENV} mode.`);
});