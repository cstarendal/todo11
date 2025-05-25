import React from 'react'

function TestApp() {
  console.log('TestApp is rendering!')
  
  return React.createElement('div', {
    style: {
      backgroundColor: 'red',
      color: 'white',
      padding: '50px',
      fontSize: '24px',
      textAlign: 'center' as const
    }
  }, 'TEST APP IS WORKING!')
}

export default TestApp
