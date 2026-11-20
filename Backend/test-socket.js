// test-socket.js
import { io } from 'socket.io-client';

// ⚠️ REPLACE THESE WITH REAL VALUES FROM YOUR DATABASE/THUNDER CLIENT
const CUSTOMER_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2YjQzZGM1LTUxZjEtNDRiOS04Yzc3LWY4ZjFkMzBjYzcwNiIsImlhdCI6MTc5NTE5ODM4OCwiZXhwIjoxNzk1MTk5Mjg4fQ.w-WSFLx5JGyTDY34xWhak_OSrPZYE5qNrbDYfGebgP8';
const DRIVER_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImQ4NTUyZDA4LWVhYzAtNGEwZS04NTRiLTA4MGJhNjU0YWIyYSIsImlhdCI6MTc5NTE5ODQxNSwiZXhwIjoxNzk1MTk5MzE1fQ.PLKblsu4sz37Y0KBr66cyeAdVdTHQV6Yz0__vjsPDRM';
const ORDER_ID = 'PASTE_ORDER_ID_HERE';

// 1. Connect as Customer
const customerSocket = io('http://localhost:5000', {
  auth: { token: CUSTOMER_TOKEN }
});

customerSocket.on('connect', () => {
  console.log('🟢 Customer connected');
  customerSocket.emit('join_order_room', { orderId: ORDER_ID });
});

customerSocket.on('connect_error', (err) => {
  console.error('🔴 Customer Connection Error:', err.message);
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
    const lat = 9.0300 + Math.random() * 0.01; 
    const lng = 38.7400 + Math.random() * 0.01;
    
    console.log(`🚗 Driver sending location: ${lat.toFixed(4)}, ${lng.toFixed(4)}`);
    driverSocket.emit('driver_location', { orderId: ORDER_ID, latitude: lat, longitude: lng });
  }, 3000);

  // Simulate sending a chat message after 4 seconds
  setTimeout(() => {
    console.log('✉️ Driver sending chat message...');
    driverSocket.emit('send_message', { orderId: ORDER_ID, message: 'Hello! I have picked up your order.' });
  }, 4000);
});

driverSocket.on('connect_error', (err) => {
  console.error('🔴 Driver Connection Error:', err.message);
});