import { z } from 'zod';
import prisma from '../config/db.js';

const productSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  price: z.string().transform((val) => parseFloat(val)), // Form-data sends numbers as strings
  stock: z.string().transform((val) => parseInt(val, 10)),
  category: z.string().optional(),
});


export const createProduct = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const merchantProfile = await prisma.merchantProfile.findUnique({
      where: { userId }
    });

    if (!merchantProfile) {
      return res.status(404).json({ message: 'Merchant profile not found.' });
    }

    if (!merchantProfile.isApproved) {
      return res.status(403).json({ message: 'Your merchant account is not approved yet. Please complete KYC.' });
    }

    const validatedData = productSchema.parse(req.body);

    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const product = await prisma.product.create({
      data: {
        merchantProfileId: merchantProfile.id,
        name: validatedData.name,
        description: validatedData.description,
        price: validatedData.price,
        stock: validatedData.stock,
        category: validatedData.category,
        imageUrl,
      }
    });

    res.status(201).json({ message: 'Product created successfully', product });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Validation error', details: error.errors });
    }
    console.error(error);
    res.status(500).json({ message: 'Server error during product creation' });
  }
};


export const getAllProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      where: { isActive: true },
      include: {
        merchantProfile: {
          select: { storeName: true, rating: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.status(200).json({ count: products.length, products });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching products' });
  }
};

export const getMyProducts = async (req, res) => {
  try {
    const userId = req.user.id;
    const merchantProfile = await prisma.merchantProfile.findUnique({ where: { userId } });

    if (!merchantProfile) return res.status(404).json({ message: 'Merchant profile not found.' });

    const products = await prisma.product.findMany({
      where: { merchantProfileId: merchantProfile.id },
      orderBy: { createdAt: 'desc' }
    });

    res.status(200).json({ count: products.length, products });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching your products' });
  }
};


export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const merchantProfile = await prisma.merchantProfile.findUnique({ where: { userId } });
    if (!merchantProfile) return res.status(404).json({ message: 'Merchant profile not found.' });

    const product = await prisma.product.findUnique({ where: { id } });
    
    if (!product || product.merchantProfileId !== merchantProfile.id) {
      return res.status(404).json({ message: 'Product not found or unauthorized' });
    }

    await prisma.product.delete({ where: { id } });

    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error deleting product' });
  }
};