import express from 'express';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { addVehicle } from '../controllers/vehicleController.js';

const router = express.Router();

// Only users with the 'DRIVER' role can add vehicles
router.post('/add', protect, authorize('DRIVER'), addVehicle);

export default router;