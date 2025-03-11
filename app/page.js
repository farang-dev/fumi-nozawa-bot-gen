// pages/App.js
'use client';

import { useState, useEffect, useRef } from 'react';
import styles from './Chat.module.css';

const App = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    const welcomeMessage = {
      role: 'assistant',
      content: `
        <div class="welcome-text">Welcome! I'm here to share Masafumi Nozawa's background. Please choose an option:</div>
      `,
    };
    setMessages([welcomeMessage]);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

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

  const callFlowiseAPI = async (userInput) => {
    setIsLoading(true);
    const startTime = Date.now();
  
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://fumi-nozawa-bot-gen.vercel.app/api/v1/prediction/b01ef746-e7cd-4c13-a10b-5eb0ed925dec';
      console.log('Calling API at:', apiUrl);
  
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: userInput }),
      });
  
      const textResponse = await response.text();
      console.log('Raw API Response:', textResponse);
  
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}: ${textResponse || 'Unknown error'}`);
      }
  
      let data;
      try {
        data = JSON.parse(textResponse);
      } catch {
        throw new Error(`Non-JSON response: ${textResponse.slice(0, 100)}...`);
      }
  
      const rawResponse = data.text || data.message || 'Sorry, I couldn’t process that.';
      const elapsedTime = Date.now() - startTime;
      const minLoadingTime = 1000;
  
      if (elapsedTime < minLoadingTime) {
        await new Promise(resolve => setTimeout(resolve, minLoadingTime - elapsedTime));
      }
  
      return formatResponse(rawResponse);
    } catch (error) {
      console.error('Error calling Flowise API:', error.message);
      return `Error: ${error.message}`;
    } finally {
      setIsLoading(false);
    }
  };

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

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className={styles.chatContainer}>
      <div className={styles.header}>
        <h1 onClick={handleRefresh}>Masafumi Nozawa</h1>
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