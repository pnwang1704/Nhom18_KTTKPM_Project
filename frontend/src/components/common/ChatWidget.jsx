import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Paperclip, Smile, MoreHorizontal, Image as ImageIcon } from 'lucide-react';
import EmojiPicker from 'emoji-picker-react';
import { useChatStore } from '../../store/useChatStore';
import { useAuthStore } from '../../store/useAuthStore';
import { apiRequest } from '../../services/api/client';

const ChatWidget = () => {
  const { isOpen, setIsOpen, socket, connect, messages, setMessages, activeConversation, setActiveConversation, isTyping } = useChatStore();
  const { user, token } = useAuthStore();
  const [inputValue, setInputValue] = useState('');
  const [showEmoji, setShowEmoji] = useState(false);
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (token) connect(token);
  }, [token]);

  useEffect(() => {
    if (isOpen && token) {
      if (!activeConversation) {
        fetchMyConversation();
      } else {
        // Nếu đã có hội thoại, vẫn tải lại tin nhắn mới nhất để đảm bảo đồng bộ
        fetchMessages(activeConversation._id);
      }
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (socket && activeConversation) {
      socket.emit('join_conversation', activeConversation._id);
    }
  }, [socket, activeConversation]);

  const fetchMyConversation = async () => {
    try {
      const res = await apiRequest('/api/chat/my-conversation');
      const result = await res.json();
      if (result.success && result.data) {
        setActiveConversation(result.data);
        fetchMessages(result.data._id);
        // Đảm bảo tham gia phòng ngay lập tức
        if (socket) {
          socket.emit('join_conversation', result.data._id);
        }
      }
    } catch (err) {
      console.error('Fetch conversation error:', err);
    }
  };

  const fetchMessages = async (convId) => {
    try {
      const res = await apiRequest(`/api/chat/messages/${convId}`);
      const result = await res.json();
      if (result.success) {
        setMessages(result.data);
      }
    } catch (err) {
      console.error('Fetch messages error:', err);
    }
  };

  const handleSendMessage = () => {
    if (!inputValue.trim() || !socket) return;

    socket.emit('send_message', {
      conversationId: activeConversation?._id,
      content: inputValue,
      senderId: user.id || user.userId,
      senderRole: 'user',
      userName: user.full_name || user.fullName
    });

    // Optimistic UI could be added here, but Socket.IO will emit 'receive_message' back
    setInputValue('');
  };

  const onEmojiClick = (emojiData) => {
    setInputValue(prev => prev + emojiData.emoji);
    setShowEmoji(false);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file || !socket) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("Ảnh quá lớn! Vui lòng chọn ảnh dưới 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      socket.emit('send_message', {
        conversationId: activeConversation?._id,
        content: '', // Bỏ chữ [Hình ảnh]
        senderId: user.id || user.userId,
        senderRole: 'user',
        userName: user.full_name || user.fullName,
        messageType: 'image',
        attachments: [{
          type: 'image',
          url: reader.result
        }]
      });
    };
    reader.readAsDataURL(file);
  };

  const handleTyping = (e) => {
    setInputValue(e.target.value);
    if (!socket || !activeConversation) return;

    socket.emit('typing_start', { 
      conversationId: activeConversation._id,
      receiverId: 'admin' // In this system, user always sends to admin
    });

    // Debounce typing_stop
    clearTimeout(window.typingTimer);
    window.typingTimer = setTimeout(() => {
      socket.emit('typing_stop', { conversationId: activeConversation._id });
    }, 2000);
  };

  // Không hiển thị cho Admin
  if (!user || user.role === 'admin') return null;

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20, transformOrigin: 'bottom right' }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="mb-4 w-[380px] h-[550px] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-gray-100"
          >
            {/* Header */}
            <div className="bg-elppa-blue p-5 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm border border-white/30">
                  <span className="font-bold text-lg">A</span>
                </div>
                <div>
                  <h4 className="font-bold">Hỗ trợ khách hàng</h4>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                    <span className="text-[10px] text-white/80 font-medium uppercase tracking-wider">Trực tuyến</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-gray-50/50">
              {messages.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4">
                  <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-elppa-blue">
                    <MessageCircle size={32} />
                  </div>
                  <div>
                    <p className="font-bold text-gray-800">Chào {user.full_name || user.fullName || 'bạn'}!</p>
                    <p className="text-sm text-gray-500 mt-1">Chúng tôi có thể giúp gì cho bạn? Hãy để lại lời nhắn nhé.</p>
                  </div>
                </div>
              )}
              
              {messages.map((msg, idx) => {
                const isMe = msg.senderRole === 'user';
                return (
                  <div key={msg._id || idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] p-3.5 rounded-2xl text-sm ${
                      isMe 
                      ? 'bg-elppa-blue text-white rounded-tr-none' 
                      : 'bg-white text-gray-800 shadow-sm border border-gray-100 rounded-tl-none'
                    }`}>
                      {msg.messageType === 'image' && msg.attachments?.[0]?.url && (
                        <div className="mb-2 rounded-lg overflow-hidden border border-white/20">
                          <img 
                            src={msg.attachments[0].url} 
                            alt="Sent image" 
                            className="max-w-full h-auto object-cover cursor-zoom-in"
                            onClick={() => window.open(msg.attachments[0].url, '_blank')}
                          />
                        </div>
                      )}
                      {msg.content && <p>{msg.content}</p>}
                      <p className={`text-[9px] mt-1.5 ${isMe ? 'text-white/60' : 'text-gray-400'}`}>
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                );
              })}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 flex gap-1 items-center">
                    <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-gray-100 relative">
              {showEmoji && (
                <div className="absolute bottom-full right-4 mb-2 z-[10001]">
                  <div className="shadow-2xl rounded-2xl overflow-hidden border border-gray-100">
                    <EmojiPicker 
                      onEmojiClick={onEmojiClick}
                      width={300}
                      height={400}
                      previewConfig={{ showPreview: false }}
                    />
                  </div>
                </div>
              )}
              
              <input 
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />

              <div className="flex items-center gap-2 bg-gray-100 rounded-2xl px-4 py-2">
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="text-gray-400 hover:text-elppa-blue transition-colors"
                  title="Gửi ảnh"
                >
                  <ImageIcon size={18} />
                </button>
                <input 
                  type="text"
                  placeholder="Nhập tin nhắn..."
                  className="flex-1 bg-transparent border-none focus:ring-0 outline-none text-sm py-2"
                  value={inputValue}
                  onChange={handleTyping}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <button 
                  onClick={() => setShowEmoji(!showEmoji)}
                  className={`transition-colors ${showEmoji ? 'text-elppa-blue' : 'text-gray-400 hover:text-elppa-blue'}`}
                >
                  <Smile size={18} />
                </button>
                <button 
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim()}
                  className={`p-2 rounded-xl transition-all ${
                    inputValue.trim() 
                    ? 'bg-elppa-blue text-white shadow-md' 
                    : 'text-gray-300'
                  }`}
                >
                  <Send size={18} />
                </button>
              </div>
              <p className="text-[10px] text-center text-gray-400 mt-3 font-medium">Đội ngũ ELPPA thường phản hồi trong vài phút</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 bg-elppa-blue text-white rounded-full shadow-2xl flex items-center justify-center hover:bg-blue-700 transition-all border-4 border-white"
      >
        {isOpen ? <X size={28} /> : <MessageCircle size={28} />}
      </motion.button>
    </div>
  );
};

export default ChatWidget;
