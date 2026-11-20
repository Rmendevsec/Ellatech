import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import prisma from './config/db.js';

export const initSocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: '*', 
      methods: ['GET', 'POST']
    }
  });

  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) return next(new Error('Authentication error: No token provided'));

      const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
      
      const user = await prisma.user.findUnique({ where: { id: decoded.id } });
      if (!user) return next(new Error('Authentication error: User not found'));

      socket.user = { id: user.id, role: user.role };
      next();
    } catch (error) {
      next(new Error('Authentication error: Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.user.id} (${socket.user.role})`);

    socket.on('join_order_room', async ({ orderId }) => {
      try {
        const order = await prisma.order.findUnique({ where: { id: orderId } });
        
        if (!order) return socket.emit('error', 'Order not found');
        
        const isCustomer = order.customerId === socket.user.id;
        const isDriver = order.driverId === socket.user.id;

        if (!isCustomer && !isDriver) {
          return socket.emit('error', 'You are not authorized to view this order');
        }

        socket.join(`order_${orderId}`);
        console.log(`User ${socket.user.id} joined room: order_${orderId}`);
        socket.emit('joined_room', `Successfully joined tracking for order ${orderId}`);
        
      } catch (error) {
        console.error(error);
        socket.emit('error', 'Failed to join room');
      }
    });

    socket.on('driver_location', async ({ orderId, latitude, longitude }) => {
      if (socket.user.role !== 'DRIVER') return;

      socket.to(`order_${orderId}`).emit('location_update', {
        driverId: socket.user.id,
        latitude,
        longitude,
        timestamp: new Date()
      });

      await prisma.driverProfile.update({
        where: { userId: socket.user.id },
        data: { currentLatitude: latitude, currentLongitude: longitude }
      });
    });

    socket.on('send_message', ({ orderId, message }) => {
      socket.to(`order_${orderId}`).emit('receive_message', {
        senderId: socket.user.id,
        role: socket.user.role,
        message,
        timestamp: new Date()
      });
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.user.id}`);
    });
  });

  return io;
};