require('dotenv').config();
const http = require('http');
const app = require('./src/app');
const { initSocket } = require('./src/sockets/socketManager');
const { port } = require('./src/config/env');
const mongoose = require('mongoose');

const server = http.createServer(app);

// Initialize Socket.IO
initSocket(server);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Chat Service connected to MongoDB');
    server.listen(port, () => {
      console.log(`Chat Service listening on port ${port}`);
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
