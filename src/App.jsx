import React, { useState, useRef, useEffect } from 'react'
import './styles.css'

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
        text: "שלום! אני Infinity Agent - הסוכן הדיגיטלי שלך. איך אני יכול לעזור לך היום?",
        sender: 'agent',
        timestamp: new Date()
      }
    ])
  }

  const simulateAgentResponse = async (userMessage) => {
    setIsTyping(true)
    
    // Simulate thinking time
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000))
    
    let response = ""
    
    // Simple AI-like responses based on keywords
    const lowerMessage = userMessage.toLowerCase()
    
    if (lowerMessage.includes('שלום') || lowerMessage.includes('היי') || lowerMessage.includes('hello')) {
      response = "שלום! נעים להכיר. איך אני יכול לעזור לך?"
    } else if (lowerMessage.includes('מה השעה') || lowerMessage.includes('זמן')) {
      response = `השעה כרגע היא ${new Date().toLocaleTimeString('he-IL')}`
    } else if (lowerMessage.includes('מה התאריך') || lowerMessage.includes('תאריך')) {
      response = `התאריך היום הוא ${new Date().toLocaleDateString('he-IL')}`
    } else if (lowerMessage.includes('חישוב') || lowerMessage.includes('מתמטיקה') || /\d+[\+\-\*\/]\d+/.test(lowerMessage)) {
      try {
        const mathExpression = lowerMessage.match(/(\d+(?:\.\d+)?)\s*([+\-*/])\s*(\d+(?:\.\d+)?)/)?.[0]
        if (mathExpression) {
          const match = lowerMessage.match(/(\d+(?:\.\d+)?)\s*([+\-*/])\s*(\d+(?:\.\d+)?)/)
          if (match) {
            const [, num1, operator, num2] = match
            const a = parseFloat(num1)
            const b = parseFloat(num2)
            let result
            
            switch (operator) {
              case '+': result = a + b; break
              case '-': result = a - b; break
              case '*': result = a * b; break
              case '/': result = b !== 0 ? a / b : 'לא ניתן לחלק באפס'; break
              default: result = 'פעולה לא נתמכת'
            }
            
            response = `התוצאה של ${mathExpression} היא: ${result}`
          } else {
            response = "אני יכול לעזור לך עם חישובים! נסה לכתוב משהו כמו '5+3' או '10*2'"
          }
        } else {
          response = "אני יכול לעזור לך עם חישובים! נסה לכתוב משהו כמו '5+3' או '10*2'"
        }
      } catch (error) {
        response = "מצטער, לא הצלחתי לחשב את זה. נסה שוב עם ביטוי מתמטי פשוט."
      }
    } else if (lowerMessage.includes('מזג אויר') || lowerMessage.includes('טמפרטורה')) {
      response = "מצטער, אני לא מחובר לשירותי מזג אויר כרגע. אבל אני יכול לעזור לך עם משימות אחרות!"
    } else if (lowerMessage.includes('עזרה') || lowerMessage.includes('help')) {
      response = `אני יכול לעזור לך עם:
• מענה על שאלות כלליות
• חישובים מתמטיים פשוטים  
• מידע על זמן ותאריך
• שיחה כללית
• ועוד הרבה דברים! פשוט שאל אותי`
    } else if (lowerMessage.includes('תודה') || lowerMessage.includes('thanks')) {
      response = "בכיף! אני כאן בשבילך. יש עוד משהו שאני יכול לעזור בו?"
    } else if (lowerMessage.includes('מי אתה') || lowerMessage.includes('מה אתה')) {
      response = "אני Infinity Agent - סוכן AI דיגיטלי שנוצר כדי לעזור לך במגוון משימות. אני יכול לענות על שאלות, לעזור עם חישובים ולשוחח איתך!"
    } else {
      const responses = [
        "זה מעניין! ספר לי עוד על זה.",
        "אני מבין. איך אני יכול לעזור לך עם זה?",
        "זו שאלה טובה! בואו נחשוב על זה יחד.",
        "מעניין מאוד. יש לך שאלות נוספות?",
        "אני כאן כדי לעזור. מה עוד אתה רוצה לדעת?",
        "זה נושא מרתק! איך אני יכול לסייע לך בנושא הזה?"
      ]
      response = responses[Math.floor(Math.random() * responses.length)]
    }
    
    setIsTyping(false)
    
    const newMessage = {
      id: Date.now(),
      text: response,
      sender: 'agent',
      timestamp: new Date()
    }
    
    setMessages(prev => [...prev, newMessage])
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
          <p>הסוכן הדיגיטלי החכם שלך</p>
          <p>מוכן לעזור לך עם שאלות, חישובים, ומשימות יומיומיות</p>
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
