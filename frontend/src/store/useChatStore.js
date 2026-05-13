import { create } from 'zustand';
import { io } from 'socket.io-client';

const CHAT_URL = 'http://localhost:3000'; // Qua Gateway

export const useChatStore = create((set, get) => ({
  socket: null,
  conversations: [],
  activeConversation: null,
  messages: [],
  isTyping: false,
  isOpen: false, // Widget open/close
  unreadTotal: 0,

  connect: (token) => {
    if (get().socket?.connected) return;

    const socket = io(CHAT_URL, {
      path: '/api/chat/socket.io', // Gateway rewrite
      auth: { token }
    });

    socket.on('connect', () => {
      console.log('Connected to Chat Service');
    });

    socket.on('receive_message', (message) => {
      const activeConv = get().activeConversation;
      // Chỉ thêm tin nhắn vào danh sách nếu nó thuộc về hội thoại đang mở
      if (activeConv && activeConv._id === message.conversationId) {
        set((state) => {
          // Tránh thêm tin nhắn trùng lặp (do cả gửi và nhận cùng lúc)
          if (state.messages.some(m => m._id === message._id)) return state;
          return { messages: [...state.messages, message] };
        });
      }
    });

    socket.on('typing_start', ({ conversationId }) => {
      if (get().activeConversation?._id === conversationId) {
        set({ isTyping: true });
      }
    });

    socket.on('typing_stop', ({ conversationId }) => {
      if (get().activeConversation?._id === conversationId) {
        set({ isTyping: false });
      }
    });

    socket.on('conversation_updated', ({ conversation }) => {
      set((state) => {
        const index = state.conversations.findIndex(c => c._id === conversation._id);
        if (index !== -1) {
          const newConversations = [...state.conversations];
          newConversations[index] = conversation;
          return { conversations: newConversations.sort((a, b) => new Date(b.lastMessageAt) - new Date(a.lastMessageAt)) };
        } else {
          return { conversations: [conversation, ...state.conversations] };
        }
      });
    });

    set({ socket });
  },

  disconnect: () => {
    get().socket?.disconnect();
    set({ socket: null });
  },

  setIsOpen: (isOpen) => set({ isOpen }),

  setActiveConversation: (conversation) => {
    const currentActive = get().activeConversation;
    
    // Nếu đổi sang hội thoại khác mới xóa messages và join room mới
    if (!currentActive || currentActive._id !== conversation?._id) {
      set({ activeConversation: conversation, messages: [] });
      if (conversation) {
        get().socket?.emit('join_conversation', conversation._id);
      }
    } else {
      // Nếu là cùng hội thoại, chỉ cập nhật thông tin (ví dụ tên, trạng thái) mà không xóa tin nhắn
      set({ activeConversation: conversation });
    }
  },

  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
  
  setMessages: (newMessages) => set((state) => {
    // Gộp tin nhắn cũ và mới, sau đó lọc theo ID để không bị trùng
    const merged = [...state.messages, ...newMessages];
    const uniqueMessages = Array.from(new Map(merged.map(m => [m._id || m.createdAt, m])).values());
    
    // Sắp xếp theo thời gian để đảm bảo thứ tự đúng
    return { 
      messages: uniqueMessages.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)) 
    };
  }),
  
  setConversations: (conversations) => set({ conversations })
}));
