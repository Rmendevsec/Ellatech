import express from 'express';
import { registerCustomer, registerDriver, registerMerchant, loginUser, getMe } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerCustomer);           
router.post('/register/driver', registerDriver);     
router.post('/register/merchant', registerMerchant);  
router.post('/login', loginUser);
router.get('/me', protect, getMe);

export default router;