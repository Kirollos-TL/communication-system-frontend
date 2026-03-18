import { X, ArrowLeft, MessageSquare, Clock, Trash2, Loader2 } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { UserChat } from "@/services/chat-service";
import { useChat } from "./context/ChatContext";

interface ChatFollowUpProps {
  onClose: () => void;
  onBack: () => void;
  onOptionSelect: (option: string) => void;
  onChatSelect: (chatId: string) => void;
  onChatWithUs: () => void;
  mode?: "options" | "history";
}

export const ChatFollowUp = ({ onClose, onBack, onOptionSelect, onChatSelect, onChatWithUs, mode = "options" }: ChatFollowUpProps) => {
  const { config, chatService } = useChat();
  const { style, followUpOptions, colors, content, user } = config;
  const [chats, setChats] = useState<UserChat[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const fetchChats = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await chatService.getUserChats(user.id);
      const sortedData = (data || []).sort((a, b) => 
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      );
      setChats(sortedData);
    } catch (error) {
      console.error("Failed to fetch user chats:", error);
    } finally {
      setIsLoading(false);
    }
  }, [user.id, chatService]);

  useEffect(() => {
    fetchChats();
  }, [fetchChats]);

  const handleDeleteChat = async (e: React.MouseEvent, chatId: string) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this conversation?")) return;

    setIsDeleting(chatId);
    try {
      await chatService.deleteChat(user.id, chatId);
      setChats(prev => prev.filter(c => c.chat_id !== chatId));
    } catch (error) {
      console.error("Failed to delete chat:", error);
      alert("Failed to delete chat. Please try again.");
    } finally {
      setIsDeleting(null);
    }
  };


  return (
    <div className="flex flex-col h-full bg-background animate-in fade-in duration-300 text-left">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-5 pb-2">
        <button
          onClick={onBack}
          className="p-1 rounded-full hover:bg-slate-100/50 transition-colors"
          style={{ color: colors.mutedText }}
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <button
          onClick={onClose}
          className="p-1 rounded-full hover:bg-slate-100/50 transition-colors"
          style={{ color: colors.mutedText }}
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="px-6 mt-2 mb-4">
        <h2 className="text-[22px] font-medium" style={{ color: colors.primaryText }}>
          {mode === "history" ? "Conversation history" : content.followUp.title}
        </h2>
      </div>

      {/* List Container */}
      <div className="flex-1 px-5 pb-8 flex flex-col min-h-0 bg-slate-50/30">
        <div className="flex-1 overflow-y-auto px-1 space-y-4 py-2 custom-scrollbar">
          
          {/* Static Options - Only show in options mode */}
          {mode === "options" && (
            <div className="flex flex-col gap-3.5 items-center w-full px-1 overflow-y-auto pb-4 text-center">
              {followUpOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => onOptionSelect(option)}
                  className="w-full max-w-[368px] shrink-0 rounded-[12px] bg-cortex-cream text-cortex-black text-base font-medium hover:brightness-95 transition-all flex items-center justify-center px-4"
                  style={{ height: style.quickReplyHeight }}
                >
                  {option}
                </button>
              ))}
            </div>
          )}

          {/* Recent Chats - Only show in history mode */}
          {mode === "history" && (
            <div className="pb-1">
               <h3 className="text-[13px] font-bold uppercase tracking-wider text-slate-400 px-1 mb-3">Recent Chats</h3>
               
               {isLoading ? (
                 <div className="space-y-3">
                   {[1, 2, 3].map((i) => (
                     <div key={i} className="h-16 w-full bg-slate-100 animate-pulse rounded-xl" />
                   ))}
                 </div>
               ) : chats.length > 0 ? (
                 <div className="space-y-3">
                    {chats.map((chat) => (
                      <div
                        key={chat.chat_id}
                        onClick={() => onChatSelect(chat.chat_id)}
                        className="w-full text-left bg-white border border-slate-100 rounded-xl p-4 hover:border-[#2B3D55] hover:bg-blue-50/30 transition-all group shadow-sm cursor-pointer relative"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex gap-3 min-w-0 pr-8">
                            <div className="mt-1 w-8 h-8 rounded-lg bg-cortex-cream flex items-center justify-center shrink-0">
                              <MessageSquare className="w-4 h-4 text-[#2B3D55]" />
                            </div>
                            <div className="min-w-0">
                              <p className="font-semibold text-[15px] text-[#2B3D55] truncate">
                                {chat.title}
                              </p>
                              <p className="text-xs text-[#737373] mt-0.5 flex items-center">
                                <Clock className="w-3 h-3 mr-1" />
                                {new Date(chat.updated_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          
                          <button
                            onClick={(e) => handleDeleteChat(e, chat.chat_id)}
                            disabled={isDeleting === chat.chat_id}
                            className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                            title="Delete conversation"
                          >
                            {isDeleting === chat.chat_id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>
                    ))}
                 </div>
               ) : (
                 <p className="text-sm text-slate-400 text-center py-4">No recent chats found.</p>
               )}
            </div>
          )}
        </div>

        <div className="mt-auto pt-6 shrink-0">
          <button
            onClick={onChatWithUs}
            className="w-full py-3.5 px-4 rounded-[14px] text-white text-[18px] hover:text-cortex-cream font-semibold transition-all shadow-lg active:scale-[0.99] flex items-center justify-center gap-2"
            style={{ background: style.gradients.button }}
          >
            {content.welcome.chatBtn}
          </button>
        </div>
      </div>
    </div>
  );
};

