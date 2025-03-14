// app/page.js
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
        <div class="welcome-text"><strong>Hey there! 👋 I’m Masafumi Nozawa.</strong><br><br>
      Welcome! Feel free to explore and ask away. Whether it’s digital marketing, web development, or my creative journey(even my hobbies), I’m here to chat.</div>
      `,
    };
    setMessages([welcomeMessage]);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const formatResponse = (text) => {
    let formatted = text.replace(/\n/g, '<br/>');
  
    // Detect URLs and make them clickable
    const urlRegex = /(https?:\/\/[^\s<]+)(?![^<]*>)/g;
    formatted = formatted.replace(urlRegex, (url) => {
      return `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`;
    });
  
    // Handle numbered lists
    const numberedListRegex = /(\d+\.\s[^\n]+)/g;
    if (numberedListRegex.test(formatted)) {
      formatted = formatted.replace(numberedListRegex, (match) => {
        const [, content] = match.match(/\d+\.\s(.*)/);
        return `<li>${content}</li>`;
      });
      formatted = `<ol>${formatted}</ol>`;
    }
  
    // Handle bullet lists
    const bulletListRegex = /(-\s[^\n]+)/g;
    if (bulletListRegex.test(formatted)) {
      formatted = formatted.replace(bulletListRegex, (match) => {
        const [, content] = match.match(/-\s(.*)/);
        return `<li>${content}</li>`;
      });
      formatted = `<ul>${formatted}</ul>`;
    }
  
    // Bold labels followed by colons
    formatted = formatted.replace(/(\w+?:)/g, '<strong>$1</strong>');
  
    return formatted;
  };

  const callFlowiseAPI = async (userInput) => {
    setIsLoading(true);
    const startTime = Date.now();

    try {
      const apiUrl = 'https://flowise-688733622589.us-east1.run.app/api/v1/prediction/b01ef746-e7cd-4c13-a10b-5eb0ed925dec';
      const apiKey = 'PDYt3towfgMv6tbeW5UiDTFSlOEyeIqDHLEkWJ2waSg';

      console.log('Sending to:', apiUrl);
      console.log('With API Key:', apiKey);

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({ question: userInput }),
      });

      const textResponse = await response.text();
      console.log('Raw Response:', textResponse);

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}: ${textResponse}`);
      }

      const data = JSON.parse(textResponse);
      const rawResponse = data.text || data.message || 'No response';
      const elapsedTime = Date.now() - startTime;
      if (elapsedTime < 1000) await new Promise(resolve => setTimeout(resolve, 1000 - elapsedTime));

      return formatResponse(rawResponse);
    } catch (error) {
      console.error('API Error:', error.message);
      return `Error: ${error.message}`;
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    const botResponse = await callFlowiseAPI(input);
    const botMessage = { role: 'assistant', content: botResponse };
    setMessages(prev => [...prev, botMessage]);
  };

  const handleOptionClick = async (option) => {
    const options = {
      '1': { query: 'Who is Masafumi Nozawa?', display: 'Who is Masafumi Nozawa?' },
      '2': { query: 'What are his services?', display: 'What are his services?' },
      '3': { query: 'What is his skillset?', display: 'What is his skillset?' },
      '4': { query: 'Show me his work samples', display: 'Show me some of his work samples' },
      '5': { query: 'Where and what did he study?', display: 'Where and what did he study?' },
      '6': { query: 'What are his professional interests?', display: 'What are his professional interests?' },
      '7': { query: 'What is his Boiler Room favorite? (DJ set)', display: 'What is his Boiler Room favorite? (DJ set)' },
      '8': { query: 'What is his contact?', display: 'What is his contact?' },
    };
    const selected = options[option];
    if (!selected) return;

    const userMessage = { role: 'user', content: selected.display };
    setMessages(prev => [...prev, userMessage]);

    const botResponse = await callFlowiseAPI(selected.query);
    const botMessage = { role: 'assistant', content: botResponse };
    setMessages(prev => [...prev, botMessage]);
  };

  const handleRefresh = () => window.location.reload();

  return (
    <div className={styles.chatContainer}>
      <div className={styles.header}><h1 onClick={handleRefresh}>Masafumi Nozawa</h1></div>
      <div className={styles.chatWindow}>
        {messages.map((msg, index) => (
          <div key={index} className={msg.role === 'user' ? styles.userMessage : index === 0 ? styles.welcomeMessage : styles.botMessage}>
            <div className={styles.messageContent} dangerouslySetInnerHTML={{ __html: msg.content }} />
            {index === 0 && msg.role === 'assistant' && (
              <div className={styles.options}>
                <button onClick={() => handleOptionClick('1')}>1. Who is Masafumi Nozawa?</button>
                <button onClick={() => handleOptionClick('2')}>2. What are his services?</button>
                <button onClick={() => handleOptionClick('3')}>3. What is his skillset?</button>
                <button onClick={() => handleOptionClick('4')}>4. Show me some work samples</button>
                <button onClick={() => handleOptionClick('5')}>5. Where and what did he study?</button>
                <button onClick={() => handleOptionClick('6')}>6. What are his professional interests?</button>
                <button onClick={() => handleOptionClick('7')}>7. What is his Boiler Room favorite? (DJ set)</button>
                <button onClick={() => handleOptionClick('8')}>8. What is his contact?</button>
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className={styles.loadingMessage}>
            <div className={styles.loadingDots}><span></span><span></span><span></span></div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>
      <form onSubmit={handleSubmit} className={styles.inputForm}>
        <input type="text" value={input} onChange={e => setInput(e.target.value)} placeholder="Type your message..." className={styles.input} />
        <button type="submit" className={styles.sendButton}>Send</button>
      </form>
    </div>
  );
};

export default App;