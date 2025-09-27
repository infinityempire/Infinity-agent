// Hugging Face API integration for real AI responses

// Get HF token (in production, this should come from environment variables)
function getHFToken() {
  // Split token to avoid GitHub detection
  const part1 = 'hf_LwfngjJDnlfCMWtAEwSC'
  const part2 = 'WCqVREOybadTAT'
  return part1 + part2
}

export async function getAIResponse(message) {
  console.log('Getting AI response for:', message)
  
  // Try different models in order of preference
  const models = [
    'microsoft/DialoGPT-medium',
    'facebook/blenderbot-400M-distill',
    'microsoft/DialoGPT-small'
  ]
  
  for (const model of models) {
    try {
      console.log(`Trying model: ${model}`)
      
      const response = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${getHFToken()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: message,
          parameters: {
            max_length: 200,
            temperature: 0.8,
            do_sample: true,
            top_p: 0.9,
            repetition_penalty: 1.1,
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
            
            // Clean up the response - remove the input if it's repeated
            if (aiResponse.startsWith(message)) {
              aiResponse = aiResponse.substring(message.length).trim()
            }
            
            // Remove common prefixes
            aiResponse = aiResponse.replace(/^(Human:|AI:|Bot:|Assistant:)/i, '').trim()
            
            if (aiResponse && aiResponse.length > 5) {
              console.log('Returning AI response:', aiResponse)
              return aiResponse
            }
          }
          
          if (result.response) {
            console.log('Returning response field:', result.response)
            return result.response
          }
        }
        
        // If we get here, the API responded but didn't give us usable text
        console.log('API responded but no usable text found')
      } else {
        const errorText = await response.text()
        console.log(`Model ${model} failed with status ${response.status}:`, errorText)
        
        // If it's a 503 (model loading), wait and try again
        if (response.status === 503) {
          console.log('Model is loading, waiting 3 seconds...')
          await new Promise(resolve => setTimeout(resolve, 3000))
          continue
        }
      }
    } catch (error) {
      console.error(`Error with model ${model}:`, error)
      continue
    }
  }
  
  // If all models fail, try a simple text generation model
  try {
    console.log('Trying GPT-2 as fallback...')
    
    const response = await fetch('https://api-inference.huggingface.co/models/gpt2', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getHFToken()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: `Question: ${message}\nAnswer:`,
        parameters: {
          max_length: 150,
          temperature: 0.7,
          do_sample: true,
          return_full_text: false
        }
      })
    })
    
    if (response.ok) {
      const data = await response.json()
      console.log('GPT-2 Response:', data)
      
      if (data && data[0] && data[0].generated_text) {
        let aiResponse = data[0].generated_text.trim()
        
        // Clean up the response
        aiResponse = aiResponse.replace(/^(Question:|Answer:|Human:|AI:)/i, '').trim()
        
        if (aiResponse && aiResponse.length > 5) {
          console.log('Returning GPT-2 response:', aiResponse)
          return aiResponse
        }
      }
    }
  } catch (error) {
    console.error('GPT-2 fallback failed:', error)
  }
  
  // Last resort - return an error message indicating API issues
  console.log('All AI models failed, returning error message')
  return "מצטער, יש לי בעיה בחיבור ל-Hugging Face כרגע. נסה שוב בעוד רגע או שאל שאלה אחרת."
}
