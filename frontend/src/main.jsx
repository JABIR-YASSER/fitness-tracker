import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Toaster } from 'react-hot-toast'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    <Toaster
      position="top-right"
      toastOptions={{
        style: {
          borderRadius: '16px',
          background: 'rgba(15, 23, 42, 0.92)',
          color: '#fff',
          border: '1px solid rgba(255,255,255,0.12)',
        },
      }}
    />
  </StrictMode>,
)
