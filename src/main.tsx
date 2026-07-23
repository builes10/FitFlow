import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './styles/index.css'

console.log('main.tsx: Starting...')

try {
  console.log('main.tsx: Creating root...')
  const rootElement = document.getElementById('root')
  if (!rootElement) throw new Error('Root element not found')

  const root = ReactDOM.createRoot(rootElement)
  console.log('main.tsx: Root created, rendering App...')

  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )
  console.log('main.tsx: Render completed')
} catch (error) {
  console.error('Failed to mount React:', error)
  const message = error instanceof Error ? error.message : String(error)
  document.body.innerHTML = `<div style="padding: 20px; color: red; font-family: monospace;">Error: ${message}</div>`
}
