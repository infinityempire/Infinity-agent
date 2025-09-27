// Hugging Face API integration for real AI responses

// Get HF token from environment variables
function getHFToken() {
  // In production, this will use the GitHub Secret HF_READ_TOKEN
  return import.meta.env.VITE_HF_TOKEN || process.env.HF_READ_TOKEN || null
}

export async function getAIResponse(message) {
  console.log('Getting AI response for:', message)
  
  const token = getHFToken()
  if (!token) {
    console.log('No HF token available')
    return "שלום! אני סוכן AI מבוסס Hugging Face. כרגע אין לי גישה ל-API, אבל אני יכול לעזור לך עם שאלות בסיסיות!"
  }
  
  console.log('Using HF token:', token ? 'Available' : 'Not available')
  
  // Try different models that should work
  const models = [
    'microsoft/DialoGPT-medium',
    'facebook/blenderbot-400M-distill',
    'microsoft/DialoGPT-small',
    'gpt2'
  ]
  
  for (const model of models) {
    try {
      console.log(`Trying model: ${model}`)
      
      const response = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: message,
          parameters: {
            max_new_tokens: 100,
            temperature: 0.7,
            do_sample: true,
            return_full_text: false
          },
          options: {
            wait_for_model: true,
            use_cache: false
          }
        })
      })
      
      console.log(`Response status: ${response.status}`)
      
      if (response.ok) {
        const data = await response.json()
        console.log('API Response:', data)
        
        if (data && Array.isArray(data) && data.length > 0) {
          const result = data[0]
          
          if (result.generated_text) {
            let aiResponse = result.generated_text.trim()
            
            // Clean up the response
            if (aiResponse.startsWith(message)) {
              aiResponse = aiResponse.substring(message.length).trim()
            }
            
            // Remove common prefixes
            aiResponse = aiResponse.replace(/^(Human:|AI:|Bot:|Assistant:)/i, '').trim()
            
            if (aiResponse && aiResponse.length > 3) {
              console.log('Returning AI response:', aiResponse)
              return aiResponse
            }
          }
          
          if (result.response) {
            console.log('Returning response field:', result.response)
            return result.response
          }
        }
        
        // If we get here, try to extract any text from the response
        if (typeof data === 'string' && data.length > 3) {
          return data.trim()
        }
        
        console.log('API responded but no usable text found')
      } else {
        const errorText = await response.text()
        console.log(`Model ${model} failed with status ${response.status}:`, errorText)
        
        // If it's a 503 (model loading), wait and try again
        if (response.status === 503) {
          console.log('Model is loading, waiting 2 seconds...')
          await new Promise(resolve => setTimeout(resolve, 2000))
          continue
        }
      }
    } catch (error) {
      console.error(`Error with model ${model}:`, error)
      continue
    }
  }
  
  // If all models fail, return a helpful message
  console.log('All AI models failed, returning fallback message')
  return "שלום! אני סוכן AI מבוסס Hugging Face. איך אני יכול לעזור לך היום? (המודלים נטענים כרגע, נסה שוב בעוד רגע)"
}
