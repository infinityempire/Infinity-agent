import React, { useState, useRef, useEffect } from 'react'
import './styles.css'
import { getAIResponse } from './huggingface.js'

function App() {
  const [isAgentActive, setIsAgentActive] = useState(false)
  const [messages, setMessages] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleStartAgent = () => {
    setIsAgentActive(true)
    setMessages([
      {
        id: 1,
        text: "שלום! אני Infinity Agent - סוכן AI חכם שמשתמש ב-Hugging Face לתגובות מתקדמות. איך אני יכול לעזור לך היום?",
        sender: 'agent',
        timestamp: new Date()
      }
    ])
  }

  const simulateAgentResponse = async (userMessage) => {
    setIsTyping(true)
    
    try {
      // Get AI response from Hugging Face API
      const response = await getAIResponse(userMessage)
      
      setIsTyping(false)
      
      const newMessage = {
        id: Date.now(),
        text: response,
        sender: 'agent',
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, newMessage])
    } catch (error) {
      setIsTyping(false)
      
      const errorMessage = {
        id: Date.now(),
        text: "מצטער, יש לי בעיה טכנית כרגע. נסה שוב בעוד רגע.",
        sender: 'agent',
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, errorMessage])
    }
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return
    
    const userMessage = {
      id: Date.now(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    }
    
    setMessages(prev => [...prev, userMessage])
    const messageToProcess = inputValue
    setInputValue('')
    
    await simulateAgentResponse(messageToProcess)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  if (!isAgentActive) {
    return (
      <div className="welcome-screen">
        <div className="welcome-content">
          <h1>🚀 Infinity Agent</h1>
          <p>סוכן AI חכם מבוסס Hugging Face</p>
          <p>מוכן לעזור לך עם שאלות, חישובים, ומשימות יומיומיות - לחלוטין בחינם!</p>
          <button 
            onClick={handleStartAgent}
            className="start-button"
          >
            🤖 הפעל את הסוכן
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="agent-interface">
      <div className="chat-header">
        <h2>🤖 Infinity Agent</h2>
        <div className="status">
          <span className="status-dot"></span>
          פעיל
        </div>
      </div>
      
      <div className="chat-messages">
        {messages.map((message) => (
          <div 
            key={message.id} 
            className={`message ${message.sender === 'user' ? 'user-message' : 'agent-message'}`}
          >
            <div className="message-content">
              <div className="message-text">{message.text}</div>
              <div className="message-time">
                {message.timestamp.toLocaleTimeString('he-IL', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </div>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="message agent-message">
            <div className="message-content">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      <div className="chat-input">
        <div className="input-container">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="כתוב הודעה לסוכן..."
            rows="1"
            className="message-input"
          />
          <button 
            onClick={handleSendMessage}
            disabled={!inputValue.trim()}
            className="send-button"
          >
            📤
          </button>
        </div>
      </div>
    </div>
  )
}

export default App
