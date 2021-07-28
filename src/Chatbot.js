import React, { useEffect } from "react";
import Amplify from "aws-amplify";
import { AmplifyChatbot } from "@aws-amplify/ui-react";
import awsconfig from "./aws-exports";

Amplify.configure(awsconfig);

const Chatbot = () => {
  const handleChatComplete = (event) => {
    const { data, err } = event.detail;
    if (data) console.log("Chat fulfilled!", JSON.stringify(data));
    if (err) console.error("Chat failed:", err);
  };

  useEffect(() => {
    const chatbotElement = document.querySelector("amplify-chatbot");
    chatbotElement.addEventListener("chatCompleted", handleChatComplete);
    return function cleanup() {
      chatbotElement.removeEventListener("chatCompleted", handleChatComplete);
    };
  }, []);

  return (
    <AmplifyChatbot
      botName="ScheduleAppointment_dev"
      botTitle="My ChatBot"
      welcomeMessage="Hello, how can I help you?"
      conversationModeOn
      textEnabled
      voiceEnabled
    />
  );
};

export default Chatbot;
