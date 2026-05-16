import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { useAuthStore } from './store/authStore'

function Root() {
  const initAuth = useAuthStore((s) => s.initAuth)
  useEffect(() => {
    void initAuth()
  }, [initAuth])
  return <App />
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Root />
  </StrictMode>,
)
