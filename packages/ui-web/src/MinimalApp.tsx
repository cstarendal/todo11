import React from 'react'

function MinimalApp() {
  return (
    <div style={{
      backgroundColor: 'white',
      color: 'black',
      padding: '50px',
      fontSize: '24px',
      fontFamily: 'Arial'
    }}>
      <h1 style={{ color: 'red', fontSize: '48px' }}>
        HELLO WORLD - DETTA FUNGERAR!
      </h1>
      <p style={{ color: 'blue' }}>
        Om du ser detta fungerar React och Vite.
      </p>
      <button 
        onClick={() => alert('Knappen fungerar!')}
        style={{
          padding: '10px 20px',
          backgroundColor: 'green',
          color: 'white',
          border: 'none',
          fontSize: '18px'
        }}
      >
        KLICKA MIG!
      </button>
    </div>
  )
}

export default MinimalApp
