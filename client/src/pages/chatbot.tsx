import React from "react";
import Bot from "../chatbot/Bot"; // adjust the path if needed

const ChatbotPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      <Bot />
    </div>
  );
};

export default ChatbotPage;