const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/env');
const { setIO } = require('./io');

let io;
const userSocketMap = new Map(); // userId -> set of socketIds

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    },
    maxHttpBufferSize: 1e7 // Tăng lên 10MB để gửi ảnh
  });

  setIO(io); // Lưu instance vào io.js

  // Authentication Middleware
  io.use((socket, next) => {
    const token = socket.handshake.auth.token || socket.handshake.headers.token;
    
    if (!token) {
      return next(new Error('Authentication error: Token missing'));
    }

    try {
      const decoded = jwt.verify(token, jwtSecret);
      socket.user = decoded; // { userId, email, role }
      next();
    } catch (err) {
      return next(new Error('Authentication error: Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    const userId = socket.user.userId;
    const role = socket.user.role;

    console.log(`User connected: ${userId} (${role}) - Socket: ${socket.id}`);

    // Map user to socket
    if (!userSocketMap.has(userId)) {
      userSocketMap.set(userId, new Set());
    }
    userSocketMap.get(userId).add(socket.id);

    // Join a private room for the user
    socket.join(`user:${userId}`);
    
    // Admins join a special room
    if (role === 'admin') {
      socket.join('admins');
    }

    // Handle joining a conversation room
    socket.on('join_conversation', (conversationId) => {
      socket.join(`conv:${conversationId}`);
      console.log(`Socket ${socket.id} joined conversation: ${conversationId}`);
    });

    // Handle sending message
    socket.on('send_message', async (data) => {
      try {
        // Require động để tránh circular dependency
        const chatService = require('../services/chat.service');
        await chatService.sendMessage(data);
      } catch (err) {
        console.error('Socket send_message error:', err);
      }
    });

    // Handle typing indicator
    socket.on('typing_start', ({ conversationId, receiverId }) => {
      socket.to(`conv:${conversationId}`).emit('typing_start', { 
        conversationId, 
        userId: userId 
      });
    });

    socket.on('typing_stop', ({ conversationId, receiverId }) => {
      socket.to(`conv:${conversationId}`).emit('typing_stop', { 
        conversationId, 
        userId: userId 
      });
    });

    socket.on('disconnect', () => {
      const userSockets = userSocketMap.get(userId);
      if (userSockets) {
        userSockets.delete(socket.id);
        if (userSockets.size === 0) {
          userSocketMap.delete(userId);
          // Emit offline status
          io.emit('user_offline', userId);
        }
      }
      console.log(`User disconnected: ${userId}`);
    });
  });

  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized!');
  }
  return io;
};

module.exports = {
  initSocket,
  getIO,
  userSocketMap
};
