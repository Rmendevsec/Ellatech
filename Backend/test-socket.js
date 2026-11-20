// test-socket.js
import { io } from 'socket.io-client';

// Replace with your actual tokens and order ID
const CUSTOMER_TOKEN = 'PASTE_YOUR_CUSTOMER_JWT_HERE';
const DRIVER_TOKEN = 'PASTE_YOUR_DRIVER_JWT_HERE';
const ORDER_ID = 'PASTE_YOUR_ORDER_ID_HERE';

// 1. Connect as Customer
const customerSocket = io('http://localhost:5000', {
  auth: { token: CUSTOMER_TOKEN }
});

customerSocket.on('connect', () => {
  console.log('🟢 Customer connected');
  customerSocket.emit('join_order_room', { orderId: ORDER_ID });
});

customerSocket.on('location_update', (data) => {
  console.log('📍 Customer received driver location:', data);
});

customerSocket.on('receive_message', (data) => {
  console.log('💬 Customer received message:', data);
});

// 2. Connect as Driver
const driverSocket = io('http://localhost:5000', {
  auth: { token: DRIVER_TOKEN }
});

driverSocket.on('connect', () => {
  console.log('🔵 Driver connected');
  driverSocket.emit('join_order_room', { orderId: ORDER_ID });

  // Simulate sending location every 3 seconds
  setInterval(() => {
    const lat = 9.0300 + Math.random() * 0.01; // Random coordinates around Addis
    const lng = 38.7400 + Math.random() * 0.01;
    
    console.log(`Driver sending location: ${lat}, ${lng}`);
    driverSocket.emit('driver_location', { orderId: ORDER_ID, latitude: lat, longitude: lng });
  }, 3000);

  // Simulate sending a chat message after 5 seconds
  setTimeout(() => {
    driverSocket.emit('send_message', { orderId: ORDER_ID, message: 'Hello! I have picked up your order.' });
  }, 5000);
});