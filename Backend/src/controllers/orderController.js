import { z } from 'zod';
import prisma from '../config/db.js';

const checkoutSchema = z.object({
  merchantProfileId: z.string().uuid(),
  deliveryAddress: z.string().min(5),
  items: z.array(
    z.object({
      productId: z.string().uuid(),
      quantity: z.number().int().positive(),
    })
  ).min(1, "Cart cannot be empty"),
});


export const createOrder = async (req, res) => {
  try {
    const customerId = req.user.id;
    const validatedData = checkoutSchema.parse(req.body);

    let totalAmount = 0;
    const orderItemsData = [];

    for (const item of validatedData.items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId }
      });

      if (!product) {
        return res.status(404).json({ message: `Product ${item.productId} not found` });
      }

      if (product.merchantProfileId !== validatedData.merchantProfileId) {
        return res.status(400).json({ message: `Product ${product.name} does not belong to this merchant` });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({ message: `Not enough stock for ${product.name}. Only ${product.stock} left.` });
      }

      totalAmount += product.price * item.quantity;
      orderItemsData.push({
        productId: product.id,
        quantity: item.quantity,
        price: product.price
      });
    }

    const order = await prisma.order.create({
      data: {
        customerId,
        merchantProfileId: validatedData.merchantProfileId,
        deliveryAddress: validatedData.deliveryAddress,
        totalAmount,
        items: {
          create: orderItemsData
        }
      }
    });

    for (const item of validatedData.items) {
      await prisma.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } }
      });
    }

    res.status(201).json({
      message: 'Order placed successfully. Waiting for a driver.',
      order
    });

  } catch (error) {
    if (error instanceof z.ZodError) return res.status(400).json({ message: 'Validation error', details: error.errors });
    console.error(error);
    res.status(500).json({ message: 'Server error during checkout' });
  }
};


export const getAvailableOrders = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: { status: 'PENDING' },
      include: {
        merchantProfile: { select: { storeName: true, storeAddress: true } },
        items: { include: { product: { select: { name: true } } } }
      },
      orderBy: { createdAt: 'asc' }
    });

    res.status(200).json({ count: orders.length, orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching orders' });
  }
};


export const acceptOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const driverId = req.user.id;

    const order = await prisma.order.findUnique({ where: { id } });
    
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.status !== 'PENDING') return res.status(400).json({ message: 'Order already accepted or completed' });

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: {
        driverId,
        status: 'ACCEPTED'
      }
    });

    res.status(200).json({ message: 'Order accepted successfully', order: updatedOrder });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error accepting order' });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; 
    const driverId = req.user.id;

    if (!['PICKED_UP', 'DELIVERED'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status update' });
    }

    const order = await prisma.order.findUnique({ 
      where: { id },
      include: { merchantProfile: true }
    });

    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.driverId !== driverId) return res.status(403).json({ message: 'You are not the driver for this order' });

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: { status }
    });

    if (status === 'DELIVERED') {
      const platformFee = order.totalAmount * 0.10;
      const merchantPayout = order.totalAmount - platformFee;

      await prisma.merchantProfile.update({
        where: { id: order.merchantProfileId },
        data: { walletBalance: { increment: merchantPayout } }
      });

      await prisma.driverProfile.update({
        where: { userId: driverId },
        data: { 
          walletBalance: { increment: order.deliveryFee },
          totalDeliveries: { increment: 1 }
        }
      });
    }

    res.status(200).json({ message: `Order marked as ${status}`, order: updatedOrder });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error updating order status' });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const customerId = req.user.id;
    const orders = await prisma.order.findMany({
      where: { customerId },
      include: { items: { include: { product: true } }, merchantProfile: { select: { storeName: true } } },
      orderBy: { createdAt: 'desc' }
    });
    res.status(200).json({ count: orders.length, orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching your orders' });
  }
};