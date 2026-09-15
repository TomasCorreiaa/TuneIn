import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './i18n';
import './index.css'
import { initSeasonalTheme } from './utils/seasonalTheme';
import App from './App.jsx'

initSeasonalTheme();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
