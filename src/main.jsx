import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {
  GoogleReCaptchaProvider,
  GoogleReCaptcha,
} from "react-google-recaptcha-v3";

createRoot(document.getElementById('root')).render(
  // <StrictMode>
  <GoogleReCaptchaProvider reCaptchaKey={import.meta.env.VITE_GOOGLE_RECAPTCHA_KEY}>

    <App />
  </GoogleReCaptchaProvider>
  // </StrictMode>,
)
