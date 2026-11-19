import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { createProduct, getAllProducts, getMyProducts, deleteProduct } from '../controllers/productController.js';

const router = express.Router();

const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `prod-${req.user.id}-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });


router.get('/', getAllProducts);

router.use(protect, authorize('MERCHANT')); 

router.post('/', upload.single('image'), createProduct);
router.get('/my-products', getMyProducts);
router.delete('/:id', deleteProduct);

export default router;