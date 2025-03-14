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
        <div class="welcome-text">Welcome! Ask me about Masafumi Nozawa or choose an option:</div>
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
    if (numberedListRegex.test(formatted)) {
      formatted = formatted.replace(numberedListRegex, (match) => {
        const [, content] = match.match(/\d+\.\s(.*)/);
        return `<li>${content}</li>`;
      });
      formatted = `<ol>${formatted}</ol>`;
    }
    const bulletListRegex = /(-\s[^\n]+)/g;
    if (bulletListRegex.test(formatted)) {
      formatted = formatted.replace(bulletListRegex, (match) => {
        const [, content] = match.match(/-\s(.*)/);
        return `<li>${content}</li>`;
      });
      formatted = `<ul>${formatted}</ul>`;
    }
    formatted = formatted.replace(/(\w+?:)/g, '<strong>$1</strong>');
    return formatted;
  };

  const callFlowiseAPI = async (userInput) => {
    setIsLoading(true);
    const startTime = Date.now();

    try {
      const apiUrl = 'https://flowise-688733622589.us-east1.run.app/api/v1/prediction/b01ef746-e7cd-4c13-a10b-5eb0ed925dec';
      const apiKey = 'ftV6krvRzNlhJx_Um5TRoaqY_kETLb03NgPKPl7Ly44';

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
      '4': { query: 'Show his contact information except for github', display: 'His Contact Information' },
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
                <button onClick={() => handleOptionClick('4')}>4. His Contact Information</button>
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