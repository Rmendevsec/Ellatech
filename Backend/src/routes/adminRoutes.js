import express from 'express';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { getPendingKYC, reviewKYC } from '../controllers/adminController.js';

const router = express.Router();

router.use(protect, authorize('ADMIN'));

router.get('/kyc/pending', getPendingKYC);
router.patch('/kyc/:kycId/review', reviewKYC);

export default router;