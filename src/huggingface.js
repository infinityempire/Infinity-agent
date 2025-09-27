// Hugging Face API integration for free AI responses
const HF_API_URL = 'https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium'

export async function getAIResponse(message) {
  try {
    // Try Hugging Face API first (free but may have rate limits)
    const response = await fetch(HF_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: message,
        parameters: {
          max_length: 100,
          temperature: 0.7,
          do_sample: true,
        }
      })
    })

    if (response.ok) {
      const data = await response.json()
      if (data && data[0] && data[0].generated_text) {
        return data[0].generated_text.replace(message, '').trim()
      }
    }
    
    // Fallback to local responses if API fails
    return getLocalResponse(message)
    
  } catch (error) {
    console.log('HF API error, using local responses:', error)
    return getLocalResponse(message)
  }
}

// Backup local responses when API is unavailable
function getLocalResponse(message) {
  const lowerMessage = message.toLowerCase()
  
  if (lowerMessage.includes('שלום') || lowerMessage.includes('היי') || lowerMessage.includes('hello')) {
    return "שלום! נעים להכיר. איך אני יכול לעזור לך?"
  } else if (lowerMessage.includes('מה השעה') || lowerMessage.includes('זמן')) {
    return `השעה כרגע היא ${new Date().toLocaleTimeString('he-IL')}`
  } else if (lowerMessage.includes('מה התאריך') || lowerMessage.includes('תאריך')) {
    return `התאריך היום הוא ${new Date().toLocaleDateString('he-IL')}`
  } else if (lowerMessage.includes('חישוב') || lowerMessage.includes('מתמטיקה') || /\d+[\+\-\*\/]\d+/.test(lowerMessage)) {
    return calculateMath(message)
  } else if (lowerMessage.includes('מזג אויר') || lowerMessage.includes('טמפרטורה')) {
    return "מצטער, אני לא מחובר לשירותי מזג אויר כרגע. אבל אני יכול לעזור לך עם משימות אחרות!"
  } else if (lowerMessage.includes('עזרה') || lowerMessage.includes('help')) {
    return `אני יכול לעזור לך עם:
• מענה על שאלות כלליות
• חישובים מתמטיים פשוטים  
• מידע על זמן ותאריך
• שיחה כללית
• ועוד הרבה דברים! פשוט שאל אותי`
  } else if (lowerMessage.includes('תודה') || lowerMessage.includes('thanks')) {
    return "בכיף! אני כאן בשבילך. יש עוד משהו שאני יכול לעזור בו?"
  } else if (lowerMessage.includes('מי אתה') || lowerMessage.includes('מה אתה')) {
    return "אני Infinity Agent - סוכן AI דיגיטלי שמשתמש ב-Hugging Face לתגובות חכמות. אני יכול לענות על שאלות, לעזור עם חישובים ולשוחח איתך!"
  } else {
    const responses = [
      "זה מעניין! ספר לי עוד על זה.",
      "אני מבין. איך אני יכול לעזור לך עם זה?",
      "זו שאלה טובה! בואו נחשוב על זה יחד.",
      "מעניין מאוד. יש לך שאלות נוספות?",
      "אני כאן כדי לעזור. מה עוד אתה רוצה לדעת?",
      "זה נושא מרתק! איך אני יכול לסייע לך בנושא הזה?"
    ]
    return responses[Math.floor(Math.random() * responses.length)]
  }
}

function calculateMath(message) {
  try {
    const match = message.match(/(\d+(?:\.\d+)?)\s*([+\-*/])\s*(\d+(?:\.\d+)?)/)
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
      
      return `התוצאה של ${match[0]} היא: ${result}`
    } else {
      return "אני יכול לעזור לך עם חישובים! נסה לכתוב משהו כמו '5+3' או '10*2'"
    }
  } catch (error) {
    return "מצטער, לא הצלחתי לחשב את זה. נסה שוב עם ביטוי מתמטי פשוט."
  }
}
