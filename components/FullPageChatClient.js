// components/FullPageChatClient.js
"use client";

import { useEffect } from 'react';

const FullPageChatClient = ({ chatflowid, apiHost }) => {
  useEffect(() => {
    // Dynamically load the Flowise script
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/flowise-embed/dist/web.js';
    script.type = 'module';
    script.async = true;
    script.onload = () => {
      // Initialize Flowise Chatbot once the script is loaded
      window.Chatbot.init({
        chatflowid: chatflowid,
        apiHost: apiHost,
        chatflowConfig: {
          // Custom config options
        },
        observersConfig: {
          observeUserInput: (userInput) => {
            console.log({ userInput });
          },
          observeMessages: (messages) => {
            console.log({ messages });
          },
          observeLoading: (loading) => {
            console.log({ loading });
          },
        },
        theme: {
          button: {
            backgroundColor: '#3B81F6',
            right: 20,
            bottom: 20,
            size: 48,
            dragAndDrop: true,
            iconColor: 'white',
            customIconSrc: 'https://raw.githubusercontent.com/walkxcode/dashboard-icons/main/svg/google-messages.svg',
            autoWindowOpen: {
              autoOpen: true,
              openDelay: 2,
              autoOpenOnMobile: false,
            },
          },
          tooltip: {
            showTooltip: true,
            tooltipMessage: 'Hi There 👋!',
            tooltipBackgroundColor: 'black',
            tooltipTextColor: 'white',
            tooltipFontSize: 16,
          },
          disclaimer: {
            title: 'Disclaimer',
            message: 'By using this chatbot, you agree to the <a target="_blank" href="https://flowiseai.com/terms">Terms & Condition</a>',
            textColor: 'black',
            buttonColor: '#3b82f6',
            buttonText: 'Start Chatting',
            buttonTextColor: 'white',
            blurredBackgroundColor: 'rgba(0, 0, 0, 0.4)',
            backgroundColor: 'white',
            denyButtonText: 'Cancel',
            denyButtonBgColor: '#ef4444',
          },
          customCSS: ``,
          chatWindow: {
            showTitle: true,
            showAgentMessages: true,
            title: 'Flowise Bot',
            titleAvatarSrc: 'https://raw.githubusercontent.com/walkxcode/dashboard-icons/main/svg/google-messages.svg',
            titleBackgroundColor: '#3B81F6',
            titleTextColor: '#ffffff',
            welcomeMessage: 'Hello! This is custom welcome message',
            errorMessage: 'This is a custom error message',
            backgroundColor: '#ffffff',
            height: 700,
            width: 400,
            fontSize: 16,
            starterPrompts: ['What is a bot?', 'Who are you?'],
            starterPromptFontSize: 15,
            clearChatOnReload: false,
            sourceDocsTitle: 'Sources:',
            renderHTML: true,
            botMessage: {
              backgroundColor: '#f7f8ff',
              textColor: '#303235',
              showAvatar: true,
              avatarSrc: 'https://raw.githubusercontent.com/zahidkhawaja/langchain-chat-nextjs/main/public/parroticon.png',
            },
            userMessage: {
              backgroundColor: '#3B81F6',
              textColor: '#ffffff',
              showAvatar: true,
              avatarSrc: 'https://raw.githubusercontent.com/zahidkhawaja/langchain-chat-nextjs/main/public/usericon.png',
            },
            textInput: {
              placeholder: 'Type your question',
              backgroundColor: '#ffffff',
              textColor: '#303235',
              sendButtonColor: '#3B81F6',
              maxChars: 50,
              maxCharsWarningMessage: 'You exceeded the characters limit. Please input less than 50 characters.',
              autoFocus: true,
              sendMessageSound: true,
              receiveMessageSound: true,
            },
            feedback: {
              color: '#303235',
            },
            dateTimeToggle: {
              date: true,
              time: true,
            },
            footer: {
              textColor: '#303235',
              text: 'Powered by',
              company: 'Flowise',
              companyLink: 'https://flowiseai.com',
            },
          },
        },
      });
    };

    document.body.appendChild(script);

    // Cleanup when the component unmounts
    return () => {
      document.body.removeChild(script);
    };
  }, [chatflowid, apiHost]);

  return null;
};

export default FullPageChatClient;
