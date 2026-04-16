import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { CodeArenaProvider } from './context/CodeArenaContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CodeArenaProvider>
      <App />
    </CodeArenaProvider>
  </StrictMode>,
)
