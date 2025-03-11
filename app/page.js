'use client';

import { useState, useEffect, useRef } from 'react';
import styles from './Chat.module.css';

const App = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef(null);

  // Initial welcome message with options
  useEffect(() => {
    const welcomeMessage = {
      role: 'assistant',
      content: `
        <div class="welcome-text">Welcome! I'm here to share Masafumi Nozawa's background. Please choose an option:</div>
      `,
    };
    setMessages([welcomeMessage]);
  }, []);

  // Auto-scroll to the bottom of the chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Function to format dynamic plain text into HTML
  const formatResponse = (text) => {
    let formatted = text.replace(/\n/g, '<br/>');
    const numberedListRegex = /(\d+\.\s[^\n]+)/g;
    const numberedItems = formatted.match(numberedListRegex);
    if (numberedItems) {
      let listHtml = '<ol>';
      numberedItems.forEach((item) => {
        const [, content] = item.match(/\d+\.\s(.*)/);
        listHtml += `<li>${content}</li>`;
      });
      listHtml += '</ol>';
      formatted = formatted.replace(numberedListRegex, listHtml);
    }
    const bulletListRegex = /(-\s[^\n]+)/g;
    const bulletItems = formatted.match(bulletListRegex);
    if (bulletItems) {
      let listHtml = '<ul>';
      bulletItems.forEach((item) => {
        const [, content] = item.match(/-\s(.*)/);
        listHtml += `<li>${content}</li>`;
      });
      listHtml += '</ul>';
      formatted = formatted.replace(bulletListRegex, listHtml);
    }
    formatted = formatted.replace(/(\w+?:)/g, '<strong>$1</strong>');
    return formatted;
  };

  // Function to call Flowise API with minimum loading time
  const callFlowiseAPI = async (userInput) => {
    setIsLoading(true);
    const startTime = Date.now();
    try {
      const response = await fetch(process.env.NEXT_PUBLIC_API_URL.replace(
        /\/api\/v1\/prediction\/[a-zA-Z0-9-]+/,
        '/api/v1/prediction'), 
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_FLOWISE_API_KEY || ''}`,
        },
        body: JSON.stringify({
          question: userInput,
        }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log('API Response:', data); // Debug log
      const rawResponse = data.text || data.message || 'Sorry, I couldn’t process that.';
  
      const elapsedTime = Date.now() - startTime;
      const minLoadingTime = 1000;
      if (elapsedTime < minLoadingTime) {
        await new Promise(resolve => setTimeout(resolve, minLoadingTime - elapsedTime));
      }
  
      return formatResponse(rawResponse);
    } catch (error) {
      console.error('Error calling Flowise API:', error.message, error.stack);
      return 'Error: Failed to get a response.';
    } finally {
      setIsLoading(false);
    }
  };

  // Handle user input submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    const botResponse = await callFlowiseAPI(input);
    const botMessage = { role: 'assistant', content: botResponse };
    setMessages((prev) => [...prev, botMessage]);
  };

  // Handle option click (maps number to query and displays full option text)
  const handleOptionClick = async (option) => {
    const options = {
      '1': { query: 'Who is Masafumi Nozawa?', display: 'Who is Masafumi Nozawa?' },
      '2': { query: 'What are his services? List his services from 1 - 5', display: 'What are his services?' },
      '3': { query: 'What is his skillset?', display: 'What is his skillset?' },
      '4': { query: 'Show his contact information except for github', display: 'His Contact Information' },
    };
    const selectedOption = options[option];
    if (!selectedOption) return;

    const userMessage = { role: 'user', content: selectedOption.display };
    setMessages((prev) => [...prev, userMessage]);

    const botResponse = await callFlowiseAPI(selectedOption.query);
    const botMessage = { role: 'assistant', content: botResponse };
    setMessages((prev) => [...prev, botMessage]);
  };

  // Function to refresh the page
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className={styles.chatContainer}>
      <div className={styles.header}>
        <h1 onClick={handleRefresh} style={{ cursor: 'pointer' }}>Masafumi Nozawa</h1>
      </div>
      <div className={styles.chatWindow}>
        {messages.map((msg, index) => (
          <div
            key={index}
            className={
              msg.role === 'user'
                ? styles.userMessage
                : index === 0
                ? styles.welcomeMessage
                : styles.botMessage
            }
          >
            <div className={styles.messageContent} dangerouslySetInnerHTML={{ __html: msg.content }} />
            {index === 0 && msg.role === 'assistant' && (
              <div className={styles.options}>
                <button onClick={() => handleOptionClick('1')}>1. Who is Masafumi Nozawa?</button>
                <button onClick={() => handleOptionClick('2')}>2. What are his services?</button>
                <button onClick={() => handleOptionClick('3')}>3. What is his skillset?</button>
                <button onClick={() => handleOptionClick('4')}>4. His Contact Information</button>
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className={styles.loadingMessage}>
            <div className={styles.loadingDots}>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>
      <form onSubmit={handleSubmit} className={styles.inputForm}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className={styles.input}
        />
        <button type="submit" className={styles.sendButton}>Send</button>
      </form>
    </div>
  );
};

export default App;
