import { useState } from "react";
import ChatIcon from "../../assets/chatwidget.svg";
import { ChatWelcome } from "./ChatWelcome";
import { ChatConversation } from "./ChatConversation";
import { ChatFollowUp } from "./ChatFollowUp";
import { ChangeRequestList } from "./ChangeRequestList";
import { ChangeRequestDetails } from "./ChangeRequestDetails";
import { CreateChangeRequest } from "./CreateChangeRequest";
import { RequestChangeModal } from "./RequestChangeModal";

import { CHAT_CONFIG, Faq } from "@/config/app-config";

export type ChatView = "closed" | "welcome" | "follow-up" | "change-requests" | "change-request-details" | "user-request-change" | "create-change-request" | "chat";



interface ChatWidgetProps {
  role?: "dev" | "user";
  currentPage?: "home" | "support";
}

const ChatWidget = ({ role = "dev", currentPage = "home" }: ChatWidgetProps) => {

  const [view, setView] = useState<ChatView>("closed");
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [selectedRequestId, setSelectedRequestId] = useState<string>("");

  const { layout, animations } = CHAT_CONFIG;


  const handleOptionSelect = (option: string | Faq) => {
    const questionText = typeof option === "string" ? option : option.question;
    const lowerText = questionText.toLowerCase();
    const isRequestChange = lowerText.includes("request a change");
    const isStatusCheck = lowerText.includes("change request status");

    if (isStatusCheck) {
      setView("change-requests");
      return;
    }

    if (isRequestChange) {
      if (role === "dev") {
        setView("change-requests");
      } else {
        setView("user-request-change");
      }
      return;
    }

    if (typeof option === "string") {
      setSelectedOption(option);
      setSelectedAnswer("");
      setView("chat");
    } else {
      setSelectedOption(option.question);
      setSelectedAnswer(option.answer);
      setView("chat");
    }
  };




  const handleChatWithUs = () => {
    setSelectedOption("");
    setSelectedAnswer("");
    setView("chat");
  };


  const handleFollowRequest = () => {
    setView("follow-up");
  };



  return (
    <div 
      className={`fixed ${layout.zIndex.panel} flex flex-col items-end gap-2 sm:gap-3`}
      style={{ 
        bottom: `min(${layout.bottom}, 4vh)`, 
        right: `min(${layout.right}, 4vw)` 
      }}
    >
      {view !== "closed" && (
        <div 
          className={`rounded-2xl overflow-hidden shadow-2xl bg-background flex flex-col ${animations.entryTransition}`}
          style={{ 
            width: `min(${layout.widgetWidth}, calc(100vw - 32px))`, 
            height: `min(${layout.widgetHeight}, calc(100vh - 100px))` 
          }}
        >
          {view === "welcome" && (
            <ChatWelcome
              role={role}
              onClose={() => setView("closed")}
              onOptionSelect={handleOptionSelect}
              onChatWithUs={handleChatWithUs}
              onFollowRequest={handleFollowRequest}
            />
          )}
          {view === "follow-up" && (

            <ChatFollowUp
              onClose={() => setView("closed")}
              onBack={() => setView("welcome")}
              onOptionSelect={handleOptionSelect}
              onChatWithUs={handleChatWithUs}
            />
          )}
          {view === "change-requests" && (
            <ChangeRequestList
              onClose={() => setView("closed")}
              onBack={() => setView("follow-up")}
              onViewRequest={(id) => {

                setSelectedRequestId(id);
                setView("change-request-details");
              }}
              onChatWithUs={handleChatWithUs}
            />
          )}
          {view === "chat" && (
            <ChatConversation
              onBack={() => setView("welcome")}
              onClose={() => setView("closed")}
              initialMessage={selectedOption}
              initialAnswer={selectedAnswer}
            />
          )}

        </div>
      )}

      {view === "change-request-details" && (
        <ChangeRequestDetails
          requestId={selectedRequestId}
          onClose={() => setView("closed")}
          onCancel={() => {
            if (role === "user") setView("user-request-change");
            else setView("change-requests");
          }}
          onSubmit={() => {
            setSelectedOption(`I'm submitting changes for request #${selectedRequestId}`);
            setView("chat");
          }}
        />
      )}

      {view === "user-request-change" && (
        <RequestChangeModal
          onClose={() => setView("closed")}
          onCancel={() => setView("welcome")}
          onSubmit={(url) => {
            setView("create-change-request");
          }}
        />
      )}

      {view === "create-change-request" && (
        <CreateChangeRequest
          onClose={() => setView("closed")}
          onCancel={() => setView("welcome")}

          onSubmit={(data) => {
            console.log("Creating request:", data);
            setSelectedOption(`I'd like to request changes: ${data.tags.join(", ")}`);
            setSelectedAnswer("Request received! Our team will review your details and get back to you shortly.");
            setView("chat");
          }}
        />
      )}


      {(view === "closed" || view === "change-request-details" || view === "user-request-change" || view === "create-change-request") && (

        <button
          onClick={() => setView("welcome")}
          className={`${layout.bubbleWidth} ${layout.bubbleHeight} pt-1 rounded-xl bg-cortex-header-gradient shadow-lg flex items-center justify-center  transition-transform ${layout.zIndex.bubble}`}
        >
          <img src={ChatIcon} alt="Chat" className="w-9 h-9" />
        </button>
      )}
    </div>
  );
};

export default ChatWidget;
