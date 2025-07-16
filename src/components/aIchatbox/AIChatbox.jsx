import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { MessageSquare, Send, X, Bot, User } from "lucide-react";
import styles from "./AIChatbox.module.css";

const AIChatbox = () => {
  const [messages, setMessages] = useState([
    { role: "ai", content: "Hello! I'm your HR assistant. How can I help you today?" }
  ]);
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef(null);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      const res = await axios.post("/api/chat/ai", { message: input });
      const aiMessage = { role: "ai", content: res.data.reply };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { 
          role: "ai", 
          content: "Sorry, I'm having trouble responding right now. Please try again later." 
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      <div 
        className={`${styles.toggleButton} ${isOpen ? styles.open : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={20} /> : <MessageSquare size={20} />}
      </div>

      {isOpen && (
        <div className={styles.chatbox}>
          <div className={styles.header}>
            <div className={styles.headerContent}>
              <Bot size={18} className={styles.botIcon} />
              <span>HR Assistant</span>
              <div className={styles.statusIndicator}></div>
              <span className={styles.statusText}>Online</span>
            </div>
            <button 
              className={styles.closeButton}
              onClick={() => setIsOpen(false)}
            >
              <X size={16} />
            </button>
          </div>
          
          <div className={styles.messages}>
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`${styles.message} ${
                  msg.role === "user" ? styles.user : styles.ai
                }`}
              >
                <div className={styles.avatar}>
                  {msg.role === "user" ? (
                    <User size={16} className={styles.userIcon} />
                  ) : (
                    <Bot size={16} className={styles.botMessageIcon} />
                  )}
                </div>
                <div className={styles.text}>{msg.content}</div>
              </div>
            ))}
            
            {isTyping && (
              <div className={`${styles.message} ${styles.ai}`}>
                <div className={styles.avatar}>
                  <Bot size={16} className={styles.botMessageIcon} />
                </div>
                <div className={styles.typingIndicator}>
                  <div className={styles.dot}></div>
                  <div className={styles.dot}></div>
                  <div className={styles.dot}></div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
          
          <div className={styles.inputArea}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Type your message..."
              disabled={isTyping}
            />
            <button 
              onClick={handleSend}
              disabled={isTyping || !input.trim()}
            >
              <Send size={16} />
            </button>
          </div>
          
          <div className={styles.footer}>
            AI assistant may produce inaccurate information
          </div>
        </div>
      )}
    </>
  );
};

export default AIChatbox;