import React, { useState } from 'react'

function App() {
  const [message, setMessage] = useState('')

  const handleRunAgent = () => {
    setMessage('🎉 Infinity Agent is ready and running!')
    alert('Infinity Agent is ready!')
  }

  return (
    <div style={{ textAlign: 'center', marginTop: '3rem', fontFamily: 'Arial' }}>
      <h1>🚀 Infinity Agent</h1>
      <p>Your AI-powered Progressive Web App is online!</p>
      <button 
        onClick={handleRunAgent}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        Run Agent
      </button>
      {message && (
        <div style={{ marginTop: '20px', color: '#4CAF50', fontWeight: 'bold' }}>
          {message}
        </div>
      )}
    </div>
  )
}

export default App
