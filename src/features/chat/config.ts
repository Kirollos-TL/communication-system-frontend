export const CHAT_CONFIG = {
  // Widget Dimensions & Positioning
  layout: {
    widgetWidth: "420px",
    widgetHeight: "614px",
    bottom: "24px", 
    right: "24px",  
    bubbleWidth: "w-16",
    bubbleHeight: "h-16",
    zIndex: {
      bubble: "z-50",
      panel: "z-50",
    },
  },

  // Design tokens
  style: {
    headerHeight: "201px",
    chatHeaderHeight: "88px",
    quickReplyHeight: "58px",
  },

  // Content & Persona
  user: {
    name: "Ahmed",
  },
  
  assistant: {
    name: "Assistant",
    defaultResponse: "Great question! Let me look into that for you.",
    arabicResponse: "أكيد طبعا اتفضل",
  },

  // Menu Options
  quickReplies: [
    "Ask about a module",
    "Request a change",
    "Give feedback",
  ],

  // Animation settings
  animations: {
    entryTransition: "animate-in slide-in-from-bottom-4 fade-in duration-300",
  }
};
