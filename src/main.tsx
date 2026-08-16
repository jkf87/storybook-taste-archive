import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/manrope'
import '@fontsource-variable/newsreader'
import './index.css'
import { App } from './App'

const rootElement = document.getElementById('root')

if (rootElement) {
  createRoot(rootElement).render(<StrictMode><App /></StrictMode>)
}

if (import.meta.env.DEV) {
  void import('react-grab')
  void import('react-scan').then(({ scan }) => scan({ enabled: true }))
}
