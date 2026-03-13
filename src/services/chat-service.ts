import { ApiClient, apiClient as defaultApiClient } from "./api";

/**
 * Interface representing a message from the backend
 */
export interface UserMessage {
  user_id: number;
  chat_id: string;
  message_id: string;
  message: string;
  sender: string;
  created_at: string;
}

/**
 * Interface representing a user chat (conversation thread)
 */
export interface UserChat {
  user_id: number;
  chat_id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

/**
 * Service for handling chat-related API interactions
 */
export class ChatService {
  private apiClient: ApiClient;

  constructor(apiClient: ApiClient = defaultApiClient) {
    this.apiClient = apiClient;
  }

  /**
   * Fetches all chats for a specific user
   * GET /api/v1/user_chats/{user_id}
   */
  async getUserChats(userId: number): Promise<UserChat[]> {
    return this.apiClient.get<UserChat[]>("home", "user_chats", { user_id: userId });
  }

  /**
   * Creates a new chat session for a user
   * POST /api/v1/user_chat
   */
  async createChat(userId: number, title: string): Promise<UserChat> {
    return this.apiClient.post<UserChat>("home", "create_user_chat", { 
      user_id: userId,
      title: title
    });
  }

  /**
   * Fetches details for a specific chat
   * GET /api/v1/user_chat/{user_id}/{chat_id}
   */
  async getChat(userId: number, chatId: string): Promise<UserChat> {
    return this.apiClient.get<UserChat>("home", "user_chat", { 
      user_id: userId,
      chat_id: chatId 
    });
  }

  /**
   * Fetches messages for a specific user and chat from the backend
   * GET /api/v1/user_message/{user_id}/{chat_id}
   */
  async getUserMessages(userId: number, chatId: string): Promise<UserMessage[]> {
    return this.apiClient.get<UserMessage[]>("home", "user_messages", { 
      user_id: userId, 
      chat_id: chatId 
    });
  }

  /**
   * Sends a new message for a specific chat
   * POST /api/v1/user_message
   */
  async sendMessage(userId: number, chatId: string, message: string, sender: 'user' | 'chatbot' | 'support' = 'user'): Promise<UserMessage> {
    return this.apiClient.post<UserMessage>("home", "create_message", { 
      user_id: userId,
      chat_id: chatId,
      message: message,
      sender: sender
    });
  }
}

// Export a singleton instance with default apiClient for backward compatibility
export const chatService = new ChatService();

export default chatService;

