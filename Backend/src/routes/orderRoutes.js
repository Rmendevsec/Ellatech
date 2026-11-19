import express from 'express';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { 
  createOrder, 
  getAvailableOrders, 
  acceptOrder, 
  updateOrderStatus,
  getMyOrders 
} from '../controllers/orderController.js';

const router = express.Router();

router.use(protect); 

router.post('/', authorize('CUSTOMER'), createOrder);
router.get('/my-orders', authorize('CUSTOMER'), getMyOrders);

router.get('/available', authorize('DRIVER'), getAvailableOrders);
router.patch('/:id/accept', authorize('DRIVER'), acceptOrder);
router.patch('/:id/status', authorize('DRIVER'), updateOrderStatus);

export default router;