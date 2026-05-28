import React from 'react'
import { hydrateRoot, createRoot } from 'react-dom/client'
import './styles/index.css'
import App from './App.jsx'

const rootElement = document.getElementById('root')

// Cek apakah HTML sudah di-prerender oleh react-snap
if (rootElement.hasChildNodes()) {
  hydrateRoot(rootElement, 
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
} else {
  // Fallback jika belum di-prerender (saat dev mode)
  const root = createRoot(rootElement)
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
}
