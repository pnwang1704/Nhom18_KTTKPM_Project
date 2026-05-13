const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
  userId: {
    type: String, // ID từ Postgres Auth Service
    required: true,
    index: true
  },
  userName: {
    type: String,
    default: 'Khách hàng'
  },
  adminId: {
    type: String,
    default: null
  },
  lastMessage: {
    type: String,
    default: ''
  },
  lastMessageAt: {
    type: Date,
    default: Date.now
  },
  unreadCount: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['open', 'closed'],
    default: 'open'
  }
}, { timestamps: true });

module.exports = mongoose.model('Conversation', conversationSchema);
