import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  MoreVertical, 
  Send, 
  Smile, 
  Paperclip, 
  User, 
  MessageCircle, 
  Check, 
  CheckCheck, 
  Image as ImageIcon,
  ChevronLeft,
  Settings,
  LogOut,
  Clock,
  Info
} from 'lucide-react';
import EmojiPicker from 'emoji-picker-react';
import { useChatStore } from '../../store/useChatStore';
import { useAuthStore } from '../../store/useAuthStore';
import { apiRequest } from '../../services/api/client';

const ChatDashboard = () => {
  const { 
    socket, connect, conversations, setConversations, 
    activeConversation, setActiveConversation, 
    messages, setMessages, isTyping 
  } = useChatStore();
  const { user, token } = useAuthStore();
  const [inputValue, setInputValue] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showEmoji, setShowEmoji] = useState(false);
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (token) {
      connect(token);
      fetchConversations();
    }
  }, [token]);

  useEffect(() => {
    if (socket && activeConversation) {
      socket.emit('join_conversation', activeConversation._id);
    }
  }, [socket, activeConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const onEmojiClick = (emojiData) => {
    setInputValue(prev => prev + emojiData.emoji);
    setShowEmoji(false);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file || !socket || !activeConversation) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("Ảnh quá lớn! Vui lòng chọn ảnh dưới 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      socket.emit('send_message', {
        conversationId: activeConversation._id,
        content: '', // Bỏ chữ [Hình ảnh]
        senderId: user.id || user.userId,
        senderRole: 'admin',
        messageType: 'image',
        attachments: [{
          type: 'image',
          url: reader.result
        }]
      });
    };
    reader.readAsDataURL(file);
  };

  const fetchConversations = async () => {
    try {
      const res = await apiRequest('/api/chat/admin/conversations');
      const result = await res.json();
      if (result.success) {
        setConversations(result.data);
      }
    } catch (err) {
      console.error('Fetch conversations error:', err);
    }
  };

  const selectConversation = async (conv) => {
    setActiveConversation(conv);
    try {
      const res = await apiRequest(`/api/chat/messages/${conv._id}`);
      const result = await res.json();
      if (result.success) {
        setMessages(result.data);
        // Mark as read
        await apiRequest(`/api/chat/read/${conv._id}`, { method: 'POST' });
        // Update unread count in list locally
        setConversations(conversations.map(c => 
          c._id === conv._id ? { ...c, unreadCount: 0 } : c
        ));
      }
    } catch (err) {
      console.error('Select conversation error:', err);
    }
  };

  const handleSendMessage = () => {
    if (!inputValue.trim() || !socket || !activeConversation) return;

    socket.emit('send_message', {
      conversationId: activeConversation._id,
      content: inputValue,
      senderId: user.id || user.userId,
      senderRole: 'admin'
    });

    setInputValue('');
  };

  const handleTyping = (e) => {
    setInputValue(e.target.value);
    if (!socket || !activeConversation) return;

    socket.emit('typing_start', { 
      conversationId: activeConversation._id,
      receiverId: activeConversation.userId
    });

    clearTimeout(window.adminTypingTimer);
    window.adminTypingTimer = setTimeout(() => {
      socket.emit('typing_stop', { conversationId: activeConversation._id });
    }, 2000);
  };

  return (
    <div className="flex h-[calc(100vh-120px)] bg-card rounded-3xl shadow-xl overflow-hidden border border-border">
      {/* Left Sidebar: Conversation List */}
      <div className="w-[350px] border-r border-border flex flex-col bg-muted/20">
        <div className="p-6">
          <h2 className="text-2xl font-black text-elppa-obsidian mb-6 tracking-tight">Hỗ trợ</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Tìm kiếm khách hàng..."
              className="w-full pl-10 pr-4 py-3 bg-card border border-border rounded-2xl focus:ring-2 focus:ring-elppa-blue/20 text-sm transition-all text-foreground"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 space-y-2 pb-6">
          {conversations.map((conv) => (
            <button
              key={conv._id}
              onClick={() => selectConversation(conv)}
              className={`w-full p-4 rounded-2xl flex items-center gap-4 transition-all duration-300 ${
                activeConversation?._id === conv._id 
                ? 'bg-elppa-blue text-white shadow-lg shadow-blue-500/20' 
                : 'hover:bg-card hover:shadow-md text-foreground'
              }`}
            >
              <div className="relative">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg ${
                  activeConversation?._id === conv._id ? 'bg-white/20' : 'bg-elppa-blue/10 text-elppa-blue'
                }`}>
                  {(conv.userName || 'U').slice(0, 1).toUpperCase()}
                </div>
                <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-card bg-green-400"></span>
              </div>
              <div className="flex-1 text-left overflow-hidden">
                <div className="flex justify-between items-start">
                  <h4 className="font-bold truncate text-sm">{conv.userName || `User ${conv.userId.slice(-6)}`}</h4>
                  <span className={`text-[10px] ${activeConversation?._id === conv._id ? 'text-white/70' : 'text-muted-foreground'}`}>
                    {new Date(conv.lastMessageAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className={`text-xs truncate mt-1 ${activeConversation?._id === conv._id ? 'text-white/80' : 'text-muted-foreground'}`}>
                  {conv.lastMessage || 'Bắt đầu cuộc trò chuyện'}
                </p>
              </div>
              {conv.unreadCount > 0 && activeConversation?._id !== conv._id && (
                <div className="w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm">
                  {conv.unreadCount}
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-card">
        {activeConversation ? (
          <>
            {/* Header */}
            <div className="p-5 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-elppa-blue/10 text-elppa-blue flex items-center justify-center font-bold">
                  {(activeConversation.userName || 'U').slice(0, 1).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-bold text-foreground">{activeConversation.userName || `User ${activeConversation.userId}`}</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>
                    <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Đang trực tuyến</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                 <button className="p-2.5 text-muted-foreground hover:bg-muted rounded-xl transition-all">
                    <Clock size={20} />
                 </button>
                 <button className="p-2.5 text-muted-foreground hover:bg-muted rounded-xl transition-all">
                    <Info size={20} />
                 </button>
                 <button className="p-2.5 text-muted-foreground hover:bg-muted rounded-xl transition-all">
                    <MoreVertical size={20} />
                 </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-muted/5">
              {messages.map((msg, idx) => {
                const isMe = msg.senderRole === 'admin';
                return (
                  <div key={msg._id || idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div className="flex flex-col space-y-1 max-w-[70%]">
                      <div className={`p-4 rounded-3xl text-sm ${
                        isMe 
                        ? 'bg-elppa-blue text-white rounded-tr-none shadow-lg shadow-blue-500/20' 
                        : 'bg-muted text-foreground shadow-md border border-border rounded-tl-none'
                      }`}>
                        {msg.messageType === 'image' && msg.attachments?.[0]?.url && (
                          <div className="mb-2 rounded-2xl overflow-hidden border border-white/10">
                            <img 
                              src={msg.attachments[0].url} 
                              alt="Sent image" 
                              className="max-w-full h-auto object-cover cursor-zoom-in"
                              onClick={() => window.open(msg.attachments[0].url, '_blank')}
                            />
                          </div>
                        )}
                        {msg.content && <p>{msg.content}</p>}
                      </div>
                      <div className={`flex items-center gap-2 px-1 ${isMe ? 'justify-end' : 'justify-start'}`}>
                         <span className="text-[10px] text-muted-foreground font-medium">
                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                         </span>
                         {isMe && <CheckCheck size={12} className="text-elppa-blue" />}
                      </div>
                    </div>
                  </div>
                );
              })}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-card p-3 rounded-2xl shadow-sm border border-border flex gap-1 items-center">
                    <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce [animation-delay:0.4s]"></span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-6 bg-card border-t border-border relative">
               {showEmoji && (
                 <div className="absolute bottom-full right-8 mb-4 z-[1001]">
                   <div className="shadow-2xl rounded-2xl overflow-hidden border border-border bg-card">
                     <EmojiPicker 
                        onEmojiClick={onEmojiClick}
                        theme={document.documentElement.classList.contains('dark') ? 'dark' : 'light'}
                        width={350}
                        height={450}
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

               <div className="flex items-center gap-4 bg-muted/50 rounded-3xl px-6 py-3 border border-border focus-within:border-elppa-blue/30 focus-within:bg-card focus-within:shadow-lg transition-all duration-300">
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="text-muted-foreground hover:text-elppa-blue transition-colors"
                  >
                    <ImageIcon size={20} />
                  </button>
                  <input 
                    type="text" 
                    placeholder="Nhập nội dung phản hồi..."
                    className="flex-1 bg-transparent border-none focus:ring-0 outline-none text-sm py-2 text-foreground"
                    value={inputValue}
                    onChange={handleTyping}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                  <button 
                    onClick={() => setShowEmoji(!showEmoji)}
                    className={`transition-colors ${showEmoji ? 'text-elppa-blue' : 'text-muted-foreground hover:text-elppa-blue'}`}
                  >
                    <Smile size={20} />
                  </button>
                  <button 
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim()}
                    className={`bg-elppa-blue text-white px-6 py-2.5 rounded-2xl font-bold text-sm shadow-lg shadow-blue-500/20 transition-all active:scale-95 disabled:opacity-50 disabled:shadow-none`}
                  >
                    Gửi phản hồi
                  </button>
               </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center bg-muted/5">
             <div className="w-24 h-24 bg-card rounded-full shadow-2xl flex items-center justify-center text-elppa-blue mb-8 border border-border">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  <User size={48} />
                </motion.div>
             </div>
             <h3 className="text-2xl font-black text-foreground mb-4">Chào mừng Admin!</h3>
             <p className="text-muted-foreground max-w-sm font-medium">Chọn một hội thoại bên trái để bắt đầu hỗ trợ khách hàng. Mọi tin nhắn sẽ được đồng bộ theo thời gian thực.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatDashboard;
